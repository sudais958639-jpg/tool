import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Clock, Plus, Trash2, Calendar, Search, X } from 'lucide-react';

// Fallback list if Intl is not fully supported or for initial render
const COMMON_ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

let ALL_ZONES: string[] = [];
try {
  // @ts-ignore
  if (Intl.supportedValuesOf) {
    // @ts-ignore
    ALL_ZONES = Intl.supportedValuesOf('timeZone');
  } else {
    ALL_ZONES = COMMON_ZONES;
  }
} catch (e) {
  ALL_ZONES = COMMON_ZONES;
}

// Ensure defaults are present
if (!ALL_ZONES.includes("UTC")) ALL_ZONES.unshift("UTC");

const TimezoneConverter: React.FC = () => {
  // Initialize with current local time
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    // Adjust to local timezone for input[type="datetime-local"] which expects YYYY-MM-DDTHH:mm
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });

  const [sourceZone, setSourceZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetZones, setTargetZones] = useState<string[]>(['UTC', 'Europe/London', 'Asia/Tokyo']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // --- LOGIC ---

  // Convert the Input String (Wall Time in Source Zone) to an absolute Timestamp (Epoch)
  // This is necessary because the input gives us "10:00" but we need to know exactly "When is it 10:00 in New York?" in absolute time.
  const absoluteDate = useMemo(() => {
    if (!dateStr) return new Date();
    const [datePart, timePart] = dateStr.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [h, min] = timePart.split(':').map(Number);

    // We need to find a UTC timestamp T such that T displayed in sourceZone is y,m,d,h,min.
    // Iterative convergence approach handles DST transitions correctly without a library.
    let t = new Date(Date.UTC(y, m - 1, d, h, min)); // Start assuming input is UTC

    for (let i = 0; i < 5; i++) {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: sourceZone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      }).formatToParts(t);

      const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
      
      // Reconstruct the wall time of t in sourceZone as a UTC timestamp for comparison
      // Note: Month is 1-based from Intl, Date.UTC expects 0-based
      const currentWallAsUtc = Date.UTC(getPart('year'), getPart('month') - 1, getPart('day'), getPart('hour'), getPart('minute'), getPart('second'));
      const targetWallAsUtc = Date.UTC(y, m - 1, d, h, min);

      const diff = currentWallAsUtc - targetWallAsUtc;
      if (Math.abs(diff) < 1000) break; // Converged

      t = new Date(t.getTime() - diff);
    }
    return t;
  }, [dateStr, sourceZone]);

  // --- HELPER ---
  const getZoneInfo = (zone: string, refDate: Date) => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZoneName: 'shortOffset'
    });
    
    const parts = fmt.formatToParts(refDate);
    const val = (type: string) => parts.find(p => p.type === type)?.value;
    
    const timeString = `${val('hour')}:${val('minute')} ${val('dayPeriod')}`;
    const dateString = `${val('weekday')}, ${val('month')} ${val('day')}`;
    const offsetString = val('timeZoneName')?.replace('GMT', '') || ''; // e.g., -05:00
    
    return { timeString, dateString, offsetString };
  };

  const getDifference = (targetDate: Date, targetZone: string) => {
    // Calculate Wall Time difference in hours
    // Construct UTC dates from the Wall Times to compare 'hours on the clock'
    const getWallAsUTC = (d: Date, z: string) => {
        const p = new Intl.DateTimeFormat('en-US', {
            timeZone: z,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }).formatToParts(d);
        const v = (t:string) => parseInt(p.find(x => x.type === t)?.value || '0');
        return Date.UTC(v('year'), v('month')-1, v('day'), v('hour'), v('minute'));
    };

    const sWall = getWallAsUTC(absoluteDate, sourceZone);
    const tWall = getWallAsUTC(absoluteDate, targetZone);
    
    const diffMs = tWall - sWall;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const sign = diffHours >= 0 ? '+' : '';
    const diffFormatted = `${sign}${Number.isInteger(diffHours) ? diffHours : diffHours.toFixed(1)}h`;

    // Day diff
    // Compare ISO date parts only to determine "Tomorrow" / "Yesterday"
    const sDate = new Date(sWall).toISOString().split('T')[0];
    const tDate = new Date(tWall).toISOString().split('T')[0];
    
    let dayLabel = '';
    if (tDate > sDate) dayLabel = 'Tomorrow';
    if (tDate < sDate) dayLabel = 'Yesterday';
    
    return { diffFormatted, dayLabel };
  };

  const sourceZoneObj = getZoneInfo(sourceZone, absoluteDate);

  const handleAddZone = (zone: string) => {
    if (!targetZones.includes(zone)) {
        setTargetZones([...targetZones, zone]);
    }
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleSwap = (zoneToSwap: string) => {
     setTargetZones(targetZones.map(z => z === zoneToSwap ? sourceZone : z));
     setSourceZone(zoneToSwap);
  };

  const filteredZones = ALL_ZONES.filter(z => z.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Time Zone Converter</h2>
        <p className="text-slate-500">Convert between multiple time zones with automatic DST adjustment.</p>
      </div>

      {/* Source Box */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-brand-100 p-6 mb-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-2 h-full bg-brand-500"></div>
         <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Base Time & Date</label>
                <input 
                    type="datetime-local" 
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-lg font-semibold text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Source Location</label>
                <div className="relative">
                     <select 
                        value={sourceZone}
                        onChange={(e) => setSourceZone(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-brand-500 outline-none"
                    >
                        {ALL_ZONES.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
            </div>
         </div>
         <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-700">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xl">{sourceZoneObj.timeString}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{sourceZoneObj.dateString}</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-400">{sourceZoneObj.offsetString}</span>
            </div>
         </div>
      </div>

      {/* Targets */}
      <div className="space-y-4">
        {targetZones.map(zone => {
            const info = getZoneInfo(zone, absoluteDate);
            const diff = getDifference(absoluteDate, zone);
            
            return (
                <div key={zone} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-brand-300 transition group">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-800 text-lg">{zone.replace(/_/g, ' ')}</h3>
                            <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{info.offsetString}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                            <span>{info.dateString}</span>
                            {diff.dayLabel && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff.dayLabel === 'Tomorrow' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>{diff.dayLabel}</span>}
                        </div>
                    </div>
                    
                    <div className="text-right flex flex-col md:items-end items-center">
                         <div className="text-2xl font-bold text-slate-800">{info.timeString}</div>
                         <div className="text-xs font-medium text-slate-400">
                            {diff.diffFormatted === '+0h' ? 'Same time' : `${diff.diffFormatted} difference`}
                         </div>
                    </div>

                    <div className="flex items-center gap-2 md:border-l md:pl-4 md:border-slate-100 md:ml-2">
                        <button onClick={() => handleSwap(zone)} title="Swap with source" className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTargetZones(targetZones.filter(z => z !== zone))} title="Remove" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            );
        })}

        {/* Add Button */}
        <button 
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition flex items-center justify-center gap-2"
        >
            <Plus className="w-5 h-5" /> Add Time Zone
        </button>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Select Time Zone</h3>
                    <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search (e.g. London, EST, Asia)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                    {filteredZones.map(z => (
                        <button 
                            key={z} 
                            onClick={() => handleAddZone(z)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium truncate"
                        >
                            {z.replace(/_/g, ' ')}
                        </button>
                    ))}
                    {filteredZones.length === 0 && <div className="text-center p-4 text-slate-400">No zones found</div>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneConverter;