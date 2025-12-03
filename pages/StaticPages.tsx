
import React from 'react';
import AdUnit from '../components/AdUnit';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Zap, Globe, Users, Target, Cpu, Heart, CheckCircle, Award, Smile } from 'lucide-react';

export const About: React.FC = () => (
  <div className="flex flex-col">
    
    {/* Full Width Banner Section */}
    <div className="w-full shadow-sm">
        {/* Dark Top Part */}
        <div className="bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-600/20 to-purple-600/20 z-0"></div>
            <div className="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
                <div className="inline-block p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                    <Wrench className="w-8 h-8 text-brand-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Empowering Your Digital Workflow</h1>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                    ToolMaster Pro is your all-in-one digital toolbox. We simplify complex tasks with powerful, free, and privacy-focused online tools for everyone.
                </p>
            </div>
        </div>

        {/* White Bottom Part (Features) */}
        <div className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mx-auto">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Lightning Fast</h3>
                        <p className="text-slate-500 text-sm">Optimized performance with client-side processing for instant results.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Privacy First</h3>
                        <p className="text-slate-500 text-sm">Your data stays on your device. We prioritize security and anonymity.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Always Free</h3>
                        <p className="text-slate-500 text-sm">Accessible to everyone, everywhere. No hidden subscriptions.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="container mx-auto px-4 py-12">
      <div className="mb-16 flex justify-center w-full no-print">
        <AdUnit type="header" />
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
             <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
             </div>
             <p className="text-slate-600 leading-relaxed flex-1">
                To democratize access to digital utilities. We believe that essential tools for development, finance, and content creation should be accessible to everyone without barriers. We strive to eliminate the friction of installing software for simple tasks by providing robust browser-based alternatives.
             </p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
             <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
             </div>
             <p className="text-slate-600 leading-relaxed flex-1">
                To become the world's most trusted and comprehensive repository of online tools. We envision a platform where students, professionals, and creators can find exactly what they need to get the job done efficiently, securely, and creatively.
             </p>
         </div>
      </div>

      {/* What We Offer */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">What We Offer</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Our platform hosts a diverse collection of over 50+ tools categorized to suit your specific needs.
              </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition">
                  <Cpu className="w-8 h-8 text-brand-600 mb-4" />
                  <h3 className="font-bold text-slate-800 mb-2">Developer Tools</h3>
                  <p className="text-sm text-slate-500">Formatters, minifiers, encoders, and generators for efficient coding.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition">
                  <Award className="w-8 h-8 text-orange-500 mb-4" />
                  <h3 className="font-bold text-slate-800 mb-2">Financial Calculators</h3>
                  <p className="text-sm text-slate-500">Investment, tax, loan, and business profit calculators.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition">
                  <Users className="w-8 h-8 text-green-500 mb-4" />
                  <h3 className="font-bold text-slate-800 mb-2">Everyday Utilities</h3>
                  <p className="text-sm text-slate-500">Unit converters, date calculators, and text manipulation tools.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition">
                  <Zap className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="font-bold text-slate-800 mb-2">AI Powered</h3>
                  <p className="text-sm text-slate-500">Next-gen AI tools for chat, image generation, and code assistance.</p>
              </div>
          </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
         <div>
             <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Core Values</h2>
             <div className="space-y-6">
                 <div className="flex gap-4">
                     <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0">
                         <Shield className="w-5 h-5" />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800">Integrity & Privacy</h4>
                         <p className="text-slate-600 text-sm">We do not sell your data. We believe in transparent operations and secure handling of information.</p>
                     </div>
                 </div>
                 <div className="flex gap-4">
                     <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0">
                         <Heart className="w-5 h-5" />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800">User-Centric Design</h4>
                         <p className="text-slate-600 text-sm">We build for you. Every tool is designed to be intuitive, responsive, and easy to use.</p>
                     </div>
                 </div>
                 <div className="flex gap-4">
                     <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center shrink-0">
                         <Zap className="w-5 h-5" />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-800">Continuous Innovation</h4>
                         <p className="text-slate-600 text-sm">We are constantly adding new tools and upgrading existing ones with the latest technology.</p>
                     </div>
                 </div>
             </div>
         </div>
         <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
             <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-8">By the Numbers</h3>
                 <div className="grid grid-cols-2 gap-8">
                     <div>
                         <p className="text-4xl font-bold text-brand-400 mb-1">50+</p>
                         <p className="text-slate-400 text-sm">Free Tools</p>
                     </div>
                     <div>
                         <p className="text-4xl font-bold text-brand-400 mb-1">100%</p>
                         <p className="text-slate-400 text-sm">Free to Use</p>
                     </div>
                     <div>
                         <p className="text-4xl font-bold text-brand-400 mb-1">24/7</p>
                         <p className="text-slate-400 text-sm">Availability</p>
                     </div>
                     <div>
                         <p className="text-4xl font-bold text-brand-400 mb-1">Global</p>
                         <p className="text-slate-400 text-sm">User Base</p>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Team / Background */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center mb-12">
          <Smile className="w-12 h-12 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Who We Are</h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
             ToolMaster Pro was founded in 2025 by a small team of passionate developers and designers who wanted to make the web a more productive place. We started with a simple calculator and grew into a comprehensive suite of utilities used by thousands daily. We are committed to maintaining this platform as a free resource for the community.
          </p>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Explore our library of tools and boost your productivity today.</p>
          <Link to="/tools" className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition shadow-lg">
             Explore All Tools <Wrench className="w-4 h-4" />
          </Link>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <div className="container mx-auto px-4 py-6">
    <div className="mb-8 no-print w-full"><AdUnit type="header" /></div>
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500">Last updated: January 2025</p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section>
          <p>
            At ToolMaster Pro, accessible from toolmasterpro.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ToolMaster Pro and how we use it.
          </p>
          <p className="mt-4">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-slate-700 mb-1">Personal Information</h3>
                    <p>
                        We may ask for personal information, such as your name and email address, only when you voluntarily provide it (e.g., through our Contact form). We do not require registration to use most of our tools.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-slate-700 mb-1">Log Files</h3>
                    <p>
                        ToolMaster Pro follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                    </p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Find and prevent fraud</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Cookies and Web Beacons</h2>
            <p>
                Like any other website, ToolMaster Pro uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Google DoubleClick DART Cookie</h2>
            <p>
                Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">https://policies.google.com/technologies/ads</a>
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Our Advertising Partners</h2>
            <p>
                Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.
            </p>
            <ul className="list-disc pl-6 mt-2">
                <li>
                    <span className="font-bold">Google</span>: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">https://policies.google.com/technologies/ads</a>
                </li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Third Party Privacy Policies</h2>
            <p>
                ToolMaster Pro's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
            <p className="mt-2">
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            </p>
        </section>
        
         <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. AI Processing and Data</h2>
            <p>
                Our website utilizes Google's Gemini API for AI-powered features (Chat, Image Generation, Code Generation). When you use these specific tools, the text prompts or images you input are sent to Google's servers for processing.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>We do not store your AI conversations or generated content on our servers permanently.</li>
                <li>Data sent to Google is subject to <a href="https://policies.google.com/privacy" className="text-brand-600 hover:underline">Google's Privacy Policy</a>.</li>
                <li>Please do not submit sensitive personal information (PII) into the AI tools.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p>Under the CCPA, among other rights, California consumers have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
            </ul>
            <p className="mt-2">If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. GDPR Data Protection Rights</h2>
            <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The right to access – You have the right to request copies of your personal data.</li>
                <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. Children's Information</h2>
            <p>
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p className="mt-2">
                ToolMaster Pro does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">11. Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy, please contact us via our contact page.
          </p>
          <div className="mt-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition">
              Go to Contact Page
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="container mx-auto px-4 py-6">
    <div className="mb-8 no-print w-full"><AdUnit type="header" /></div>
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <div className="border-b border-slate-100 pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Terms and Conditions</h1>
        <p className="text-slate-500">Last updated: January 2025</p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">1. Introduction</h2>
          <p>
            Welcome to ToolMaster Pro. By accessing our website and using our tools, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. Use License & User Responsibilities</h2>
          <p className="mb-2">
            Permission is granted to temporarily use the materials (information or software) on ToolMaster Pro's website for personal, non-commercial transitory viewing only. Under this license, you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>Attempt to decompile or reverse engineer any software contained on ToolMaster Pro's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            As a user, you agree not to use our tools for any illegal or unauthorized purpose. You must not transmit any worms, viruses, or any code of a destructive nature.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. Intellectual Property Rights</h2>
          <p>
            The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use, or publication by you of any such matters or any part of the Site, except as allowed by Section 2, is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">4. Disclaimer & Limitation of Liability</h2>
          <p className="mb-4">
            The materials on ToolMaster Pro's website are provided on an 'as is' basis. ToolMaster Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="bg-slate-50 p-4 rounded-lg border-l-4 border-brand-500">
            <strong>Limitation of Liability:</strong> In no event shall ToolMaster Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ToolMaster Pro's website, even if ToolMaster Pro or a ToolMaster Pro authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">5. AI Tools & Third-Party Services</h2>
          <p>
            Our website utilizes artificial intelligence services provided by Google (Gemini API). By using our AI-powered tools (Chat, Image Generation, Summarizer, Code Generator), you acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Output is generated by AI and may occasionally be inaccurate or misleading.</li>
            <li>You should not rely on AI for professional legal, medical, or financial advice.</li>
            <li>Data submitted to AI tools may be processed by third-party providers for the purpose of generating content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">6. Account & Payments</h2>
          <p>
            Currently, ToolMaster Pro allows access to most tools without account registration. However, we reserve the right to implement user accounts or premium features in the future. The services are currently provided free of charge, supported by advertisements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">8. Changes to Terms</h2>
          <p>
            ToolMaster Pro reserves the right to revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us via our contact page.
          </p>
          <div className="mt-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition">
              Go to Contact Page
            </Link>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => (
  <div className="container mx-auto px-4 py-6">
    <div className="mb-8 no-print w-full"><AdUnit type="header" /></div>
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea rows={5} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="How can we help?"></textarea>
        </div>
        <button type="button" className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition">Send Message</button>
      </form>
    </div>
  </div>
);
