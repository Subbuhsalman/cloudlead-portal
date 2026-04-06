import moment from 'moment'
import React from 'react'
import { data } from './data'

const Page = () => {
    return (
        <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl text-gray-800 leading-relaxed'>
            <h1 className='text-3xl font-bold text-center text-gray-900 mb-4'>
                Cloud Lead PRIVACY POLICY
            </h1>
            <p className='text-sm text-gray-500 text-center mb-8'>
                <strong>Last Updated:</strong> {moment().format('MMMM D, YYYY')}
            </p>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>1. INTRODUCTION</h2>
                <p className='mb-2'>
                    Cloud Lead (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a specialized logistics and
                    shipping management platform with integrated social media scheduling
                    capabilities. This Privacy Policy explains how we collect, use, protect,
                    and share your personal information when you use our services.
                </p>
                <p>
                    Your privacy is important to us. This Privacy Policy describes our
                    practices regarding the collection, use, protection, and disclosure of
                    information received from your use of our website, mobile applications,
                    and services (collectively, the &quot;Service&quot;).
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>2. INFORMATION WE COLLECT</h2>

                <h3 className='text-xl font-medium mt-4 mb-2'>2.1 Personal Information You Provide</h3>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title</li>
                    <li><strong>Billing Information:</strong> Credit card details, billing address, tax identification numbers</li>
                    <li><strong>Profile Information:</strong> Profile picture, business description, preferences</li>
                    <li><strong>Communications:</strong> Support requests, feedback, and correspondence with us</li>
                    <li><strong>Shipping & Logistics Data:</strong> Shipment details, tracking information, warehouse locations, supplier information, delivery addresses</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>2.2 Social Media Account Information</h3>
                <p className='mb-2'>When you connect your social media accounts to our platform for scheduling posts:</p>

                {data.map((section, idx) => (
                    <div key={idx} className='mt-4'>
                        <h4 className='font-semibold'>{section.title}</h4>
                        <ul className='list-disc list-inside pl-4 text-gray-700'>
                            {section.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                <h3 className='text-xl font-medium mt-6 mb-2'>2.3 Automatically Collected Information</h3>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, click patterns</li>
                    <li><strong>Log Data:</strong> Server logs, error reports, performance metrics</li>
                    <li><strong>Cookies and Tracking:</strong> As described in our Cookie Policy section</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>2.4 Third-Party Sources</h3>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Social media platforms (as described above)</li>
                    <li>Business partners and integrations</li>
                    <li>Public databases and shipping carriers</li>
                    <li>Analytics and marketing service providers</li>
                </ul>
            </section>
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>3. HOW WE USE YOUR INFORMATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>3.1 Primary Business Functions</h3>
                <p className='mb-2'>We use your information to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Provide and maintain our shipping and logistics management services</li>
                    <li>Process transactions and manage billing</li>
                    <li>Create and manage your account</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Improve our platform and develop new features</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>3.2 Social Media Scheduling Functions</h3>
                <p className='mb-2'>For our social media scheduling feature, we use your information to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Connect and authenticate your social media accounts</li>
                    <li>Schedule and publish content on your behalf</li>
                    <li>Provide analytics and performance insights</li>
                    <li>Optimize posting times and content strategies</li>
                    <li>Manage multiple social media accounts from one dashboard</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>3.3 Analytics and Insights</h3>
                <p className='mb-2'>We analyze data to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Generate shipping and logistics reports</li>
                    <li>Provide social media performance analytics</li>
                    <li>Identify trends and optimization opportunities</li>
                    <li>Benchmark performance against industry standards</li>
                    <li>Provide personalized recommendations</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>3.4 Communications</h3>
                <p className='mb-2'>We may use your information to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Send service-related notifications</li>
                    <li>Provide marketing communications (with consent)</li>
                    <li>Share platform updates and new features</li>
                    <li>Send security alerts and important notices</li>
                </ul>
            </section>
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>4. HOW WE SHARE YOUR INFORMATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>4.1 With Your Consent</h3>
                <p className='mb-2'>We share information when you explicitly consent, including:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Publishing content to your connected social media accounts</li>
                    <li>Sharing data with third-party integrations you authorize</li>
                    <li>Providing information to business partners you select</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.2 Service Providers</h3>
                <p className='mb-2'>We share information with trusted third-party service providers who assist us in:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Cloud hosting and data storage</li>
                    <li>Payment processing</li>
                    <li>Email and communication services</li>
                    <li>Analytics and monitoring</li>
                    <li>Customer support tools</li>
                    <li>Social media platform APIs</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.3 Social Media Platforms</h3>
                <p className='mb-2'>When you use our social media scheduling feature, we share:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Content you want to publish</li>
                    <li>Scheduling preferences</li>
                    <li>Authentication tokens (securely encrypted)</li>
                    <li>Engagement data for analytics purposes</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.4 Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</p>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.5 Legal Requirements</h3>
                <p className='mb-2'>We may disclose information when required by law or to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Comply with legal process or government requests</li>
                    <li>Protect against fraud or security threats</li>
                    <li>Enforce our agreements and policies</li>
                    <li>Protect the rights and safety of users</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>5. DATA SECURITY</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>5.1 Security Measures</h3>
                <p className='mb-2'>We implement industry-standard security measures including:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Encryption in transit and at rest</li>
                    <li>Secure access controls and authentication</li>
                    <li>Regular security audits and assessments</li>
                    <li>Employee training on data protection</li>
                    <li>Incident response procedures</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.2 Social Media Security</h3>
                <p className='mb-2'>For social media integrations, we:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Use OAuth 2.0 for secure authentication</li>
                    <li>Store access tokens with encryption</li>
                    <li>Implement token refresh mechanisms</li>
                    <li>Monitor for unauthorized access</li>
                    <li>Provide secure revocation of access</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.3 Limitations</h3>
                <p>While we implement strong security measures, no system is completely secure. We cannot guarantee absolute security of your information.</p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>6. DATA RETENTION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>6.1 General Retention</h3>
                <p className='mb-2'>We retain personal information for as long as necessary to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Provide our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce our agreements</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.2 Social Media Data</h3>
                <p className='mb-2'>Social media data is retained according to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Platform-specific requirements</li>
                    <li>Analytics needs (typically 24 months)</li>
                    <li>User preferences and settings</li>
                    <li>Legal and compliance requirements</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.3 Deletion Requests</h3>
                <p>You may request deletion of your data at any time, subject to legal and operational requirements.</p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>7. YOUR RIGHTS AND CHOICES</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>7.1 Access and Control</h3>
                <p className='mb-2'>You have the right to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                    <li>Restrict processing</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.2 Social Media Controls</h3>
                <p className='mb-2'>For social media features, you can:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Disconnect social media accounts</li>
                    <li>Revoke posting permissions</li>
                    <li>Control data sharing preferences</li>
                    <li>Manage content visibility settings</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.3 Communication Preferences</h3>
                <p className='mb-2'>You can:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Opt out of marketing communications</li>
                    <li>Control notification settings</li>
                    <li>Update contact preferences</li>
                    <li>Manage email subscriptions</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.4 Cookie Management</h3>
                <p className='mb-2'>You can:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Control cookie preferences</li>
                    <li>Disable tracking cookies</li>
                    <li>Manage analytics opt-outs</li>
                    <li>Clear stored cookies</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>8. INTERNATIONAL DATA TRANSFERS</h2>
                <p className='mb-4'>
                    We may transfer your information to countries outside your residence, including the United States. 
                    When we transfer your personal information internationally, we implement appropriate safeguards to 
                    protect your information, including:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Standard Contractual Clauses approved by the European Commission</li>
                    <li>Adequacy decisions by relevant data protection authorities</li>
                    <li>Certification schemes and codes of conduct</li>
                    <li>Binding corporate rules for intra-group transfers</li>
                </ul>
                <p className='mt-4'>
                    We ensure that any international transfer of your personal data complies with applicable 
                    data protection laws and maintains the same level of protection as provided in your home jurisdiction.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>9. CHILDREN'S PRIVACY</h2>
                <p className='mb-4'>
                    Our Service is not intended for children under 16 years of age. We do not knowingly collect 
                    personal information from children under 16. If you are a parent or guardian and you are aware 
                    that your child has provided us with personal information, please contact us immediately.
                </p>
                <p className='mb-4'>
                    If we become aware that we have collected personal information from children under 16 without 
                    verification of parental consent, we will take steps to remove that information from our servers.
                </p>
                <p>
                    For users in jurisdictions where the minimum age for data processing consent is different 
                    (such as 13 in the US under COPPA), we comply with the applicable local requirements.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>10. CALIFORNIA PRIVACY RIGHTS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>10.1 CCPA Rights</h3>
                <p className='mb-2'>
                    If you are a California resident, the California Consumer Privacy Act (CCPA) provides you 
                    with specific rights regarding your personal information:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Right to Know:</strong> What personal information we collect, use, disclose, and sell</li>
                    <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                    <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of your personal information</li>
                    <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your privacy rights</li>
                    <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>10.2 How to Exercise Your Rights</h3>
                <p className='mb-2'>To exercise your California privacy rights:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Email us at: california-privacy@shippingminds.com</li>
                    <li>Call our toll-free number: 717-371-4874</li>
                    <li>Submit a request through our online portal</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>10.3 Verification Process</h3>
                <p>
                    We will verify your identity before processing your request. We may request additional 
                    information to verify your identity and ensure the security of your personal information.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>10.4 Shine the Light Law</h3>
                <p>
                    California residents may request information about sharing personal information with 
                    third parties for their direct marketing purposes during the preceding calendar year.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>11. EUROPEAN PRIVACY RIGHTS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>11.1 GDPR Compliance</h3>
                <p className='mb-2'>
                    If you are in the European Economic Area (EEA), the General Data Protection Regulation (GDPR) 
                    provides you with certain rights:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Right of Access:</strong> Obtain confirmation and access to your personal data</li>
                    <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
                    <li><strong>Right to Restrict Processing:</strong> Limit how we process your personal data</li>
                    <li><strong>Right to Data Portability:</strong> Receive your personal data in a portable format</li>
                    <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>11.2 Legal Basis for Processing</h3>
                <p className='mb-2'>We process your personal data based on:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Contract:</strong> To provide our services and fulfill our contractual obligations</li>
                    <li><strong>Consent:</strong> Where you have provided explicit consent</li>
                    <li><strong>Legitimate Interests:</strong> For analytics, marketing, and service improvement</li>
                    <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>11.3 Data Protection Officer</h3>
                <p>
                    You may contact our Data Protection Officer for privacy-related inquiries at: 
                    dpo@shippingminds.com
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>11.4 Supervisory Authority</h3>
                <p>
                    You have the right to lodge a complaint with your local data protection supervisory authority 
                    if you believe our processing of your personal data violates applicable law.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>12. SOCIAL MEDIA PLATFORM COMPLIANCE</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>12.1 Platform-Specific Policies</h3>
                <p className='mb-2'>We comply with the privacy and data policies of:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Facebook/Meta Platform Policy and Data Policy</li>
                    <li>Instagram Terms of Use and Data Policy</li>
                    <li>LinkedIn API Terms of Use and Privacy Policy</li>
                    <li>Twitter/X Developer Policy and Privacy Policy</li>
                    <li>TikTok Developer Terms and Privacy Policy</li>
                    <li>YouTube API Terms of Service and Privacy Policy</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>12.2 Platform Data Practices</h3>
                <p className='mb-2'>We ensure our practices align with social media platform requirements for:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Data collection and use limitations</li>
                    <li>User consent mechanisms and permissions</li>
                    <li>Content moderation and community guidelines</li>
                    <li>Analytics and reporting restrictions</li>
                    <li>API usage compliance and rate limiting</li>
                    <li>Data retention and deletion requirements</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>12.3 Platform Changes</h3>
                <p>
                    Social media platforms may change their policies, APIs, or data access permissions. 
                    We will update our practices accordingly and notify users of any material changes 
                    that affect their data or service functionality.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>12.4 Third-Party Responsibilities</h3>
                <p>
                    When you connect your social media accounts, you are also subject to those platforms' 
                    own privacy policies and terms of service. We encourage you to review their policies 
                    to understand how they handle your data.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>13. COOKIES AND TRACKING TECHNOLOGIES</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>13.1 Types of Cookies</h3>
                <p className='mb-2'>We use different types of cookies and similar technologies:</p>
                
                <div className='mt-4'>
                    <h4 className='font-semibold'>Essential Cookies</h4>
                    <p className='text-gray-700 mb-2'>Required for platform functionality, including:</p>
                    <ul className='list-disc list-inside pl-4 text-gray-700'>
                        <li>Authentication and security</li>
                        <li>Session management</li>
                        <li>Load balancing</li>
                        <li>CSRF protection</li>
                    </ul>
                </div>

                <div className='mt-4'>
                    <h4 className='font-semibold'>Analytics Cookies</h4>
                    <p className='text-gray-700 mb-2'>To understand usage patterns and improve our service:</p>
                    <ul className='list-disc list-inside pl-4 text-gray-700'>
                        <li>Google Analytics</li>
                        <li>Usage statistics and heatmaps</li>
                        <li>Performance monitoring</li>
                        <li>A/B testing</li>
                    </ul>
                </div>

                <div className='mt-4'>
                    <h4 className='font-semibold'>Marketing Cookies</h4>
                    <p className='text-gray-700 mb-2'>For advertising and promotional purposes:</p>
                    <ul className='list-disc list-inside pl-4 text-gray-700'>
                        <li>Conversion tracking</li>
                        <li>Retargeting and remarketing</li>
                        <li>Social media advertising</li>
                        <li>Email marketing optimization</li>
                    </ul>
                </div>

                <div className='mt-4'>
                    <h4 className='font-semibold'>Social Media Cookies</h4>
                    <p className='text-gray-700 mb-2'>For social media integrations:</p>
                    <ul className='list-disc list-inside pl-4 text-gray-700'>
                        <li>Social login authentication</li>
                        <li>Content sharing buttons</li>
                        <li>Social media widgets</li>
                        <li>Cross-platform analytics</li>
                    </ul>
                </div>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.2 Third-Party Tracking</h3>
                <p className='mb-2'>
                    We may use third-party analytics and marketing tools that collect information about your 
                    online activities across different websites and services. These include:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Google Analytics and Google Ads</li>
                    <li>Facebook Pixel and Meta Business Tools</li>
                    <li>LinkedIn Insight Tag</li>
                    <li>Twitter Analytics</li>
                    <li>Customer relationship management (CRM) tools</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.3 Your Cookie Choices</h3>
                <p className='mb-2'>You can control cookies through:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Our cookie preference center (accessible from our website)</li>
                    <li>Your browser settings and privacy controls</li>
                    <li>Third-party opt-out tools and industry initiatives</li>
                    <li>Mobile device advertising settings</li>
                </ul>
                <p className='mt-4'>
                    Please note that disabling certain cookies may affect the functionality of our Service.
                </p>
            </section>

            {/* 14. UPDATES TO THIS POLICY */}
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>14. UPDATES TO THIS POLICY</h2>
                <p className='mb-4'>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, 
                    technology, legal requirements, or other factors. When we make material changes to this 
                    Privacy Policy, we will notify you by:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Posting the updated policy on our website with a new &quot;Last Updated&quot; date</li>
                    <li>Sending email notifications to registered users</li>
                    <li>Providing in-app notifications when you next log in</li>
                    <li>Posting announcements on our social media channels</li>
                </ul>
                <p className='mb-4'>
                    For non-material changes, we will update the policy and modify the &quot;Last Updated&quot; date. 
                    We encourage you to review this Privacy Policy periodically to stay informed about how 
                    we collect, use, and protect your information.
                </p>
                <p className='mb-4'>
                    Your continued use of our Service after any changes to this Privacy Policy constitutes 
                    your acceptance of the updated policy. If you do not agree with the changes, you should 
                    stop using our Service and may request deletion of your account and personal information.
                </p>
                <p>
                    We will retain previous versions of this Privacy Policy in our records and can provide 
                    them upon request for your reference.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>15. CONTACT INFORMATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>15.1 General Privacy Inquiries</h3>
                <p className='mb-2'>For privacy-related questions, requests, or concerns, please contact us:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Email:</strong> privacy@shippingminds.com</li>
                    <li><strong>Mailing Address:</strong> Lancaster City, Pennsylvania United States (EST)</li>
                    <li><strong>Phone:</strong> 717-371-4874</li>
                    <li><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM EST</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.2 Security Incidents</h3>
                <p className='mb-2'>To report security incidents or vulnerabilities:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>Email:</strong> security@shippingminds.com</li>
                    <li><strong>Response Time:</strong> We aim to respond within 24 hours</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.3 Response Times</h3>
                <p className='mb-2'>We strive to respond to all privacy inquiries promptly:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>General Inquiries:</strong> Within 5 business days</li>
                    <li><strong>GDPR Requests:</strong> Within 1 month (may be extended to 3 months for complex requests)</li>
                    <li><strong>CCPA Requests:</strong> Within 45 days (may be extended by 45 days with notice)</li>
                    <li><strong>Security Issues:</strong> Within 24 hours for acknowledgment</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>16. DISPUTE RESOLUTION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>16.1 Informal Resolution</h3>
                <p className='mb-4'>
                    We encourage you to contact us first to resolve any privacy-related concerns informally. 
                    Most issues can be resolved through direct communication with our privacy team at 
                    privacy@shippingminds.com.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.2 Arbitration Agreement</h3>
                <p className='mb-4'>
                    For disputes that cannot be resolved informally, and except where prohibited by law, 
                    any dispute arising out of or relating to this Privacy Policy or our privacy practices 
                    will be resolved through binding arbitration rather than in court.
                </p>
                <p className='mb-4'>
                    The arbitration will be conducted by a neutral arbitrator in accordance with the 
                    Commercial Arbitration Rules of the American Arbitration Association (AAA). 
                    The arbitration will take place in United States or remotely via video conference.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.3 Exceptions to Arbitration</h3>
                <p className='mb-2'>
                    The following disputes are not subject to arbitration and may be brought in court:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Disputes seeking injunctive or other equitable relief</li>
                    <li>Small claims court disputes (up to the jurisdictional limit)</li>
                    <li>Disputes where arbitration is prohibited by law</li>
                    <li>Individual claims under consumer protection laws where arbitration waivers are unenforceable</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.4 Class Action Waiver</h3>
                <p className='mb-4'>
                    Where legally permissible, you agree that disputes will be resolved on an individual basis. 
                    You waive any right to participate in class-action lawsuits or class-wide arbitration, 
                    except where such waivers are prohibited by law.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.5 Governing Law</h3>
                <p className='mb-4'>
                    This Privacy Policy and any disputes arising from it will be governed by the laws of 
                    Pennsylvania / Lancaster city, without regard to conflict of law principles. However, applicable 
                    privacy laws such as GDPR, CCPA, and other regional privacy regulations will also apply 
                    where required.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.6 Jurisdiction</h3>
                <p className='mb-4'>
                    For disputes not subject to arbitration, you agree that the exclusive jurisdiction for 
                    resolving such disputes will be the state and federal courts located in United States.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>16.7 Regulatory Complaints</h3>
                <p className='mb-2'>
                    Nothing in this section prevents you from filing complaints with relevant regulatory authorities:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li><strong>EU/EEA:</strong> Your local data protection supervisory authority</li>
                    <li><strong>California:</strong> California Attorney General's Office</li>
                    <li><strong>Other Jurisdictions:</strong> Relevant privacy or consumer protection agencies</li>
                </ul>
            </section>
            <section className='mt-10 border-t pt-6'>
                <h2 className='text-2xl font-semibold mb-3'>17. EFFECTIVE DATE</h2>
                <p className='mb-4'>
                    This Privacy Policy is effective as of the &quot;Last Updated&quot; date specified at the top of 
                    this document and replaces any prior privacy policies. The policy applies to all 
                    information collected by Cloud Lead from the effective date forward.
                </p>
                <p className='mb-4'>
                    If you have an existing account with us, your continued use of our Service after the 
                    effective date constitutes your acceptance of this Privacy Policy. If you are a new user, 
                    your acceptance occurs when you first use our Service or create an account.
                </p>
                <p className='mb-4'>
                    For users in jurisdictions requiring explicit consent for data processing, we will 
                    seek your consent for this Privacy Policy through appropriate consent mechanisms 
                    within our Service.
                </p>
            </section>


        </div>
    )
}

export default Page