import moment from 'moment'
import React from 'react'

const TermsOfService = () => {
    return (
        <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl text-gray-800 leading-relaxed'>
            <h1 className='text-3xl font-bold text-center text-gray-900 mb-4'>
                Cloud Lead TERMS OF SERVICE
            </h1>
            <p className='text-sm text-gray-500 text-center mb-8'>
                <strong>Last Updated:</strong> {moment().format('MMMM D, YYYY')}
            </p>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>1. ACCEPTANCE OF TERMS</h2>
                <p className='mb-4'>
                    Welcome to Cloud Lead (we,us, our, or Company), a specialized platform providing 
                    logistics management and social media scheduling services for the shipping and logistics industry. 
                    These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," 
                    or "User") and Cloud Lead.
                </p>
                <p className='mb-4'>
                    By accessing, browsing, or using our website, mobile applications, or services (collectively, the "Service"), 
                    you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. 
                    If you do not agree to these Terms, you may not use our Service.
                </p>
                <p className='font-semibold text-red-600'>
                    PLEASE READ THESE TERMS CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION REGARDING YOUR LEGAL RIGHTS, 
                    REMEDIES, AND OBLIGATIONS, INCLUDING VARIOUS LIMITATIONS AND EXCLUSIONS.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>2. ELIGIBILITY AND ACCOUNT REGISTRATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>2.1 Age and Capacity Requirements</h3>
                <p className='mb-2'>
                    You must be at least 18 years old or the age of majority in your jurisdiction to use our Service. 
                    By using our Service, you represent and warrant that:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>You are at least 18 years old</li>
                    <li>You have the legal capacity to enter into these Terms</li>
                    <li>You have not been previously suspended or removed from our Service</li>
                    <li>Your registration and use comply with all applicable laws and regulations</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>2.2 Business Entity Registration</h3>
                <p className='mb-2'>If you are registering on behalf of a business or organization:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>You represent that you have authority to bind such entity to these Terms</li>
                    <li>The entity agrees to be bound by these Terms</li>
                    <li>Both you individually and the entity are liable for compliance with these Terms</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>2.3 Account Information</h3>
                <p className='mb-2'>When creating an account, you agree to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information as necessary</li>
                    <li>Keep your account credentials secure and confidential</li>
                    <li>Be responsible for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>2.4 One Account Per User</h3>
                <p>You may only create and maintain one account. Multiple accounts by the same user are prohibited.</p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>3. SERVICE DESCRIPTION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>3.1 Shipping and Logistics Management</h3>
                <p className='mb-2'>Cloud Lead provides:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Shipment tracking and management tools</li>
                    <li>Inventory and warehouse management</li>
                    <li>Supplier and vendor coordination</li>
                    <li>Route optimization and logistics planning</li>
                    <li>Reporting and analytics for shipping operations</li>
                    <li>Integration with major shipping carriers and logistics providers</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>3.2 Social Media Scheduling Platform</h3>
                <p className='mb-2'>Our social media scheduling feature provides:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Multi-platform content scheduling and publishing</li>
                    <li>Social media account management</li>
                    <li>Content calendar and planning tools</li>
                    <li>Analytics and performance tracking</li>
                    <li>Engagement monitoring and reporting</li>
                </ul>
                <p className='mb-2'>Integration with major social media platforms including:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Facebook (Pages and Profiles)</li>
                    <li>Instagram (Business and Creator accounts)</li>
                    <li>LinkedIn (Personal and Company pages)</li>
                    <li>Twitter/X</li>
                    <li>TikTok (Business accounts)</li>
                    <li>YouTube</li>
                    <li>Other platforms as added</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>3.3 Service Modifications</h3>
                <p className='mb-2'>We reserve the right to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Modify, update, or discontinue any part of the Service</li>
                    <li>Add or remove features and functionalities</li>
                    <li>Change service availability or accessibility</li>
                    <li>Update system requirements or supported platforms</li>
                </ul>
                <p>Such changes may be made with or without notice, though we will make reasonable efforts to notify users of material changes.</p>
            </section>
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>4. USER CONDUCT AND ACCEPTABLE USE</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>4.1 Permitted Uses</h3>
                <p className='mb-2'>You may use our Service only for:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Legitimate business purposes in the shipping and logistics industry</li>
                    <li>Managing and optimizing your logistics operations</li>
                    <li>Creating and scheduling social media content for your business</li>
                    <li>Analyzing performance and generating reports</li>
                    <li>Complying with all applicable laws and regulations</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.2 Prohibited Activities</h3>
                <p className='mb-2'>You agree not to:</p>
                
                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>General Prohibitions:</h4>
                    <ul className='list-disc list-inside space-y-1 pl-4 text-gray-700'>
                        <li>Violate any applicable laws, regulations, or third-party rights</li>
                        <li>Use the Service for any unlawful or unauthorized purpose</li>
                        <li>Interfere with or disrupt the Service or its servers</li>
                        <li>Attempt to gain unauthorized access to any part of the Service</li>
                        <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                        <li>Use automated tools to access the Service without permission</li>
                        <li>Share your account credentials with others</li>
                    </ul>
                </div>

                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>Content-Related Prohibitions:</h4>
                    <ul className='list-disc list-inside space-y-1 pl-4 text-gray-700'>
                        <li>Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable</li>
                        <li>Infringe upon any intellectual property rights</li>
                        <li>Distribute spam, malware, or other malicious content</li>
                        <li>Engage in any form of harassment or cyberbullying</li>
                        <li>Impersonate any person or entity</li>
                    </ul>
                </div>

                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>Social Media Specific Prohibitions:</h4>
                    <ul className='list-disc list-inside space-y-1 pl-4 text-gray-700'>
                        <li>Violate any social media platform's terms of service or community guidelines</li>
                        <li>Engage in artificial engagement or manipulation (bot followers, fake likes, etc.)</li>
                        <li>Post misleading, false, or deceptive content</li>
                        <li>Engage in coordinated inauthentic behavior</li>
                        <li>Attempt to hack or compromise connected social media accounts</li>
                    </ul>
                </div>

                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>Commercial Prohibitions:</h4>
                    <ul className='list-disc list-inside space-y-1 pl-4 text-gray-700'>
                        <li>Resell, redistribute, or sublicense the Service</li>
                        <li>Use the Service to compete with us</li>
                        <li>Extract or harvest data for unauthorized purposes</li>
                        <li>Create derivative works based on our Service</li>
                    </ul>
                </div>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.3 Social Media Platform Compliance</h3>
                <p className='mb-2'>When using our social media scheduling features, you must:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Comply with all applicable social media platform terms and policies</li>
                    <li>Respect platform-specific content guidelines and community standards</li>
                    <li>Maintain appropriate licensing for any content you post</li>
                    <li>Honor platform rate limits and API usage restrictions</li>
                    <li>Ensure you have proper rights and permissions for all content</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>4.4 Enforcement</h3>
                <p className='mb-2'>We may, at our sole discretion:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Suspend or terminate accounts that violate these Terms</li>
                    <li>Remove or modify content that violates our policies</li>
                    <li>Report violations to appropriate authorities</li>
                    <li>Take legal action for serious violations</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>5. INTELLECTUAL PROPERTY RIGHTS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>5.1 Our Intellectual Property</h3>
                <p className='mb-4'>
                    The Service and all related materials, including but not limited to software, text, graphics, 
                    logos, images, audio, video, and their selection and arrangement, are owned by Cloud Lead 
                    or our licensors and are protected by intellectual property laws.
                </p>
                <p className='mb-2'>
                    You are granted a limited, non-exclusive, non-transferable, non-sublicensable, revocable license 
                    to use the Service solely as permitted by these Terms. This license does not include any right to:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Reproduce, distribute, or publicly display our content</li>
                    <li>Modify or create derivative works</li>
                    <li>Reverse engineer or attempt to extract source code</li>
                    <li>Remove or alter any proprietary notices</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.2 User Content Ownership</h3>
                <p className='mb-2'>
                    You retain ownership of all content you create, upload, or submit to the Service ("User Content"), including:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Shipping and logistics data</li>
                    <li>Social media posts and content</li>
                    <li>Images, videos, and other media</li>
                    <li>Business information and data</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.3 License Grant to Us</h3>
                <p className='mb-2'>
                    By using our Service, you grant us a worldwide, non-exclusive, royalty-free, transferable license to:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Use, reproduce, and distribute your User Content as necessary to provide the Service</li>
                    <li>Publish your social media content to connected platforms</li>
                    <li>Store and process your data for analytics and insights</li>
                    <li>Display your content within our Service interface</li>
                    <li>Create aggregated, anonymized data for service improvement</li>
                </ul>
                <p>
                    This license exists only for the duration of your use of our Service and terminates when you 
                    delete your account or remove specific content.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.4 DMCA Compliance</h3>
                <p className='mb-2'>
                    We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). 
                    If you believe your copyrighted work has been infringed, please contact us with:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Identification of the copyrighted work</li>
                    <li>Location of the infringing material</li>
                    <li>Your contact information</li>
                    <li>A statement of good faith belief</li>
                    <li>A statement of accuracy under penalty of perjury</li>
                    <li>Your physical or electronic signature</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>5.5 Trademark Policy</h3>
                <p>
                    You may not use our trademarks, logos, or brand names without our written permission. 
                    We respect third-party trademarks and will investigate reported violations.
                </p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>6. PAYMENT TERMS AND BILLING</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>6.1 Subscription Plans</h3>
                <p className='mb-2'>
                    Our Service is offered through various subscription plans with different features and pricing tiers. 
                    Current pricing is available on our website and may vary by:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Feature set and service level</li>
                    <li>Number of users or accounts</li>
                    <li>Volume of data or transactions</li>
                    <li>Geographic location</li>
                    <li>Promotional offers</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.2 Payment Authorization</h3>
                <p className='mb-2'>By providing payment information, you:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Authorize us to charge the applicable fees</li>
                    <li>Represent that you have authority to use the payment method</li>
                    <li>Agree to pay all charges incurred under your account</li>
                    <li>Authorize automatic renewal charges (where applicable)</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.3 Billing Cycles</h3>
                <p className='mb-2'>
                    Fees are billed in advance on a recurring basis (monthly or annually, depending on your plan). 
                    Billing occurs on:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>The same day each month for monthly plans</li>
                    <li>The anniversary date for annual plans</li>
                    <li>Pro-rated amounts for mid-cycle changes</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.4 Price Changes</h3>
                <p className='mb-2'>We may change our pricing with:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>30 days' notice for existing subscribers</li>
                    <li>Immediate effect for new subscribers</li>
                    <li>Grandfathering of existing rates when reasonable</li>
                    <li>Option to cancel if you disagree with changes</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.5 Refund Policy</h3>
                <p className='mb-4'>
                    <strong>General Policy:</strong> All fees are non-refundable except as required by law or as specifically stated in these Terms.
                </p>
                <p className='mb-2'><strong>Exceptions:</strong></p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Technical issues preventing service use for extended periods</li>
                    <li>Billing errors or unauthorized charges</li>
                    <li>Legal requirements in your jurisdiction</li>
                    <li>Specific refund guarantees we may offer</li>
                </ul>
                <p>
                    <strong>Process:</strong> To request a refund, contact our support team with your account information and reason for the request.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.6 Taxes</h3>
                <p>You are responsible for all applicable taxes, duties, and governmental charges related to your use of the Service.</p>

                <h3 className='text-xl font-medium mt-6 mb-2'>6.7 Delinquent Accounts</h3>
                <p className='mb-2'>If payment is not received when due:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Your account may be suspended after notice</li>
                    <li>Service access may be restricted</li>
                    <li>Additional fees may apply for collection efforts</li>
                    <li>Your account and data may be deleted after extended non-payment</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>7. PRIVACY AND DATA PROTECTION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>7.1 Privacy Policy Incorporation</h3>
                <p>
                    Our Privacy Policy is incorporated into these Terms by reference. By using our Service, 
                    you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.2 Data Processing</h3>
                <p className='mb-2'>We process your data to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Provide and improve our Service</li>
                    <li>Facilitate social media posting and analytics</li>
                    <li>Generate insights and reports</li>
                    <li>Communicate with you about our Service</li>
                    <li>Comply with legal obligations</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.3 Social Media Data</h3>
                <p className='mb-2'>When you connect social media accounts:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>We access only the data necessary for our Service</li>
                    <li>We comply with each platform's API terms and data policies</li>
                    <li>You can revoke access at any time</li>
                    <li>We provide tools to manage your data sharing preferences</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.4 Data Security</h3>
                <p>
                    We implement appropriate technical and organizational measures to protect your data, 
                    but cannot guarantee absolute security.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>7.5 International Transfers</h3>
                <p>
                    Your data may be processed in countries other than your residence. We ensure appropriate 
                    safeguards are in place for such transfers.
                </p>
            </section>
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>8. SOCIAL MEDIA PLATFORM INTEGRATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>8.1 Third-Party Platform Terms</h3>
                <p>
                    Your use of connected social media platforms is subject to their respective terms of service 
                    and privacy policies. You are responsible for complying with all such terms.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>8.2 Platform Changes</h3>
                <p className='mb-2'>Social media platforms may:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Change their APIs or terms of service</li>
                    <li>Limit or discontinue certain features</li>
                    <li>Modify data access permissions</li>
                    <li>Implement new restrictions</li>
                </ul>
                <p>
                    Such changes may affect our Service functionality, and we are not liable for any resulting 
                    limitations or disruptions.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>8.3 Content Responsibility</h3>
                <p className='mb-2'>You are solely responsible for:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>All content posted through our Service</li>
                    <li>Compliance with platform-specific guidelines</li>
                    <li>Obtaining necessary rights and permissions</li>
                    <li>Monitoring and managing your social media presence</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>8.4 Platform Violations</h3>
                <p>
                    If a social media platform suspends or restricts your account due to content posted through 
                    our Service, we are not responsible for such actions.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>8.5 API Limitations</h3>
                <p className='mb-2'>Our Service is subject to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Rate limits imposed by social media platforms</li>
                    <li>API access restrictions and requirements</li>
                    <li>Data availability and accuracy limitations</li>
                    <li>Platform maintenance and downtime</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>9. SERVICE AVAILABILITY AND MODIFICATIONS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>9.1 Service Availability</h3>
                <p className='mb-2'>While we strive to provide reliable service, we do not guarantee:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Uninterrupted or error-free operation</li>
                    <li>Compatibility with all devices or browsers</li>
                    <li>Availability at all times or locations</li>
                    <li>Immunity from technical issues or external factors</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>9.2 Maintenance and Updates</h3>
                <p className='mb-2'>We may perform maintenance, updates, or modifications that may:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Temporarily interrupt service availability</li>
                    <li>Change functionality or user interface</li>
                    <li>Require user action or account updates</li>
                    <li>Affect data access or processing</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>9.3 Service Modifications</h3>
                <p className='mb-2'>We reserve the right to:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Add, modify, or remove features</li>
                    <li>Change system requirements or supported platforms</li>
                    <li>Update integration capabilities</li>
                    <li>Modify pricing or plan structures</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>9.4 Service Discontinuation</h3>
                <p className='mb-2'>We may discontinue the Service or specific features with reasonable notice, except in cases of:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>Legal or regulatory requirements</li>
                    <li>Security threats or violations</li>
                    <li>Technical constraints or limitations</li>
                    <li>Business necessity</li>
                </ul>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>10. WARRANTIES AND DISCLAIMERS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>10.1 Limited Warranty</h3>
                <p>
                    We warrant that our Service will perform substantially in accordance with our published 
                    documentation under normal use conditions.
                </p>

                <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6'>
                    <h3 className='text-xl font-medium mb-2'>10.2 DISCLAIMER OF WARRANTIES</h3>
                    <p className='mb-4 font-semibold'>
                        EXCEPT AS EXPRESSLY SET FORTH IN THESE TERMS, THE SERVICE IS PROVIDED "AS IS" AND 
                        "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
                    </p>
                    <p className='mb-2'>WE SPECIFICALLY DISCLAIM:</p>
                    <ul className='list-disc list-inside space-y-1 pl-4'>
                        <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
                        <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                        <li>NON-INFRINGEMENT</li>
                        <li>ACCURACY OR COMPLETENESS OF DATA</li>
                        <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                        <li>SECURITY OR PRIVACY PROTECTION</li>
                        <li>COMPATIBILITY WITH THIRD-PARTY PLATFORMS</li>
                    </ul>
                </div>

                <h3 className='text-xl font-medium mt-6 mb-2'>10.3 Third-Party Services</h3>
                <p>
                    We disclaim all warranties regarding third-party services, platforms, or integrations, 
                    including social media platforms.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>10.4 User Responsibility</h3>
                <p className='mb-2'>You acknowledge that:</p>
                <ul className='list-disc list-inside space-y-1 pl-4'>
                    <li>You use the Service at your own risk</li>
                    <li>You are responsible for evaluating the Service's suitability for your needs</li>
                    <li>You should maintain backups of important data</li>
                    <li>No advice or information from us creates additional warranties</li>
                </ul>
            </section>

            <section className='mb-8'>
                <div className='bg-red-50 border-l-4 border-red-400 p-6'>
                    <h2 className='text-2xl font-semibold mb-3'>11. LIMITATION OF LIABILITY</h2>
                    
                    <h3 className='text-xl font-medium mt-4 mb-2'>11.1 GENERAL LIMITATIONS</h3>
                    <p className='mb-4 font-semibold'>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL Cloud Lead, ITS AFFILIATES, 
                        OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR:
                    </p>
                    
                    <div className='mb-4'>
                        <h4 className='font-semibold mb-2'>TYPES OF DAMAGES:</h4>
                        <ul className='list-disc list-inside space-y-1 pl-4'>
                            <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                            <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
                            <li>COST OF SUBSTITUTE SERVICES</li>
                            <li>BUSINESS INTERRUPTION OR LOST OPPORTUNITIES</li>
                            <li>REPUTATIONAL HARM OR GOODWILL LOSS</li>
                        </ul>
                    </div>

                    <div className='mb-4'>
                        <h4 className='font-semibold mb-2'>CIRCUMSTANCES:</h4>
                        <ul className='list-disc list-inside space-y-1 pl-4'>
                            <li>SERVICE INTERRUPTIONS OR UNAVAILABILITY</li>
                            <li>DATA LOSS OR CORRUPTION</li>
                            <li>THIRD-PARTY ACTIONS OR FAILURES</li>
                            <li>UNAUTHORIZED ACCESS TO YOUR ACCOUNT</li>
                            <li>SOCIAL MEDIA PLATFORM RESTRICTIONS OR CHANGES</li>
                            <li>CONTENT MODERATION OR REMOVAL</li>
                        </ul>
                    </div>

                    <h3 className='text-xl font-medium mt-6 mb-2'>11.2 MONETARY LIMITS</h3>
                    <p className='font-semibold mb-4'>
                        OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL NOT EXCEED THE LESSER OF:
                    </p>
                    <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                        <li>THE TOTAL AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM</li>
                        <li>$1,000 USD</li>
                    </ul>

                    <h3 className='text-xl font-medium mt-6 mb-2'>11.3 Essential Purpose</h3>
                    <p className='mb-4'>
                        The limitations in this section apply even if any limited remedy fails of its essential purpose.
                    </p>

                    <h3 className='text-xl font-medium mt-6 mb-2'>11.4 Jurisdictional Variations</h3>
                    <p>
                        Some jurisdictions do not allow certain limitations, so these limitations may not apply to you 
                        to the extent prohibited by applicable law.
                    </p>
                </div>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>12. INDEMNIFICATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>12.1 Your Indemnification Obligations</h3>
                <p className='mb-2'>
                    You agree to indemnify, defend, and hold harmless Cloud Lead, its affiliates, officers, directors, 
                    employees, agents, and licensors from and against all claims, liabilities, damages, losses, costs, 
                    and expenses (including reasonable attorneys' fees) arising from or relating to:
                </p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Content you post or transmit through the Service</li>
                    <li>Your violation of any social media platform terms</li>
                    <li>Any false or misleading information you provide</li>
                    <li>Your business operations or logistics activities</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>12.2 Procedure</h3>
                <p className='mb-2'>We will:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Promptly notify you of any claim subject to indemnification</li>
                    <li>Give you control of the defense and settlement (with our approval)</li>
                    <li>Provide reasonable assistance at your expense</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>12.3 Our Right to Participate</h3>
                <p>We reserve the right to participate in the defense of any claim at our own expense.</p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>13. TERMINATION</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>13.1 Termination by You</h3>
                <p className='mb-2'>You may terminate your account and these Terms at any time by:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Canceling your subscription through your account settings</li>
                    <li>Contacting our customer support</li>
                    <li>Following our account deletion procedures</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.2 Termination by Us</h3>
                <p className='mb-2'>We may suspend or terminate your account and these Terms immediately, with or without notice, if:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>You violate any provision of these Terms</li>
                    <li>You engage in fraudulent or illegal activities</li>
                    <li>Your account becomes delinquent</li>
                    <li>We discontinue the Service</li>
                    <li>Required by law or regulation</li>
                    <li>You pose a security risk to our Service or other users</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.3 Effect of Termination</h3>
                <p className='mb-2'>Upon termination:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Your access to the Service will be discontinued</li>
                    <li>Your data may be deleted (subject to our retention policies)</li>
                    <li>Outstanding fees remain due and payable</li>
                    <li>Accrued rights and obligations survive termination</li>
                    <li>You must cease all use of our intellectual property</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.4 Data Retention and Deletion</h3>
                <p className='mb-2'>After termination:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>We may retain your data for legal or operational purposes</li>
                    <li>You may request data deletion (subject to legal requirements)</li>
                    <li>Backup copies may persist for a reasonable period</li>
                    <li>Public content may remain on social media platforms</li>
                </ul>

                <h3 className='text-xl font-medium mt-6 mb-2'>13.5 No Refund Upon Termination</h3>
                <p>Termination does not entitle you to any refund of prepaid fees, except as required by law.</p>
            </section>

            {/* 14. DISPUTE RESOLUTION */}
            <section className='mb-8'>
                <div className='bg-blue-50 border-l-4 border-blue-400 p-6'>
                    <h2 className='text-2xl font-semibold mb-3'>14. DISPUTE RESOLUTION</h2>
                    
                    <h3 className='text-xl font-medium mt-4 mb-2'>14.1 Informal Resolution</h3>
                    <p className='mb-4'>
                        Before pursuing formal dispute resolution, you agree to contact us at legal@shippingminds.com 
                        to seek an informal resolution. We will work in good faith to resolve disputes amicably.
                    </p>

                    <h3 className='text-xl font-medium mt-6 mb-2'>14.2 Binding Arbitration</h3>
                    <p className='mb-4'>
                        <strong>Agreement to Arbitrate:</strong> Except as provided below, all disputes arising out of or relating to 
                        these Terms or the Service will be resolved through final and binding arbitration rather than in court.
                    </p>
                    <p className='mb-4'>
                        <strong>Arbitration Rules:</strong> Arbitration will be conducted under the Commercial Arbitration Rules of the 
                        American Arbitration Association (AAA) or similar organization in your jurisdiction.
                    </p>
                    <p className='mb-4'>
                        <strong>Individual Basis:</strong> Arbitration will be conducted on an individual basis. You waive any right to 
                        participate in class action lawsuits or class-wide arbitration.
                    </p>
                    <p className='mb-4'>
                        <strong>Location:</strong> Arbitration will take place in Lancaster city or another mutually agreed location.
                    </p>

                    <h3 className='text-xl font-medium mt-6 mb-2'>14.3 Exceptions to Arbitration</h3>
                    <p className='mb-2'>The following disputes are not subject to arbitration:</p>
                    <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                        <li>Intellectual property claims</li>
                        <li>Small claims court matters (within jurisdictional limits)</li>
                        <li>Injunctive or equitable relief requests</li>
                        <li>Disputes involving our Terms of Service violations</li>
                    </ul>

                    <h3 className='text-xl font-medium mt-6 mb-2'>14.4 Waiver of Jury Trial</h3>
                    <p className='mb-4 font-semibold'>
                        TO THE EXTENT ARBITRATION DOES NOT APPLY, YOU WAIVE YOUR RIGHT TO A JURY TRIAL.
                    </p>

                    <h3 className='text-xl font-medium mt-6 mb-2'>14.5 Opt-Out Right</h3>
                    <p>
                        You may opt out of binding arbitration by sending written notice to legal@shippingminds.com 
                        within 30 days of accepting these Terms.
                    </p>
                </div>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>15. GENERAL LEGAL PROVISIONS</h2>
                
                <h3 className='text-xl font-medium mt-4 mb-2'>15.1 Governing Law</h3>
                <p>These Terms are governed by the laws of United States, without regard to conflict of law principles.</p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.2 Jurisdiction and Venue</h3>
                <p>
                    Subject to the arbitration provisions above, any legal proceedings must be brought in the state 
                    or federal courts located in United States.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.3 Severability</h3>
                <p>
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will 
                    remain in full force and effect.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.4 Waiver</h3>
                <p>
                    Our failure to enforce any provision of these Terms does not constitute a waiver of that 
                    provision or any other provision.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.5 Assignment</h3>
                <p>
                    You may not assign or transfer these Terms or your account without our written consent. 
                    We may assign these Terms without restriction.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.6 Entire Agreement</h3>
                <p>
                    These Terms, together with our Privacy Policy and any other referenced documents, constitute 
                    the entire agreement between you and us regarding the Service.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.7 Survival</h3>
                <p>
                    Provisions that by their nature should survive termination will survive, including intellectual property, 
                    limitation of liability, indemnification, and dispute resolution provisions.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.8 Updates to Terms</h3>
                <p className='mb-2'>We may update these Terms from time to time. We will notify you of material changes by:</p>
                <ul className='list-disc list-inside space-y-1 pl-4 mb-4'>
                    <li>Posting updated Terms on our website</li>
                    <li>Sending email notifications</li>
                    <li>Providing in-app notifications</li>
                    <li>Updating the "Last Updated" date</li>
                </ul>
                <p>Continued use of the Service after changes become effective constitutes acceptance of the updated Terms.</p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.9 Force Majeure</h3>
                <p>
                    We are not liable for any failure or delay in performance due to circumstances beyond our reasonable control, 
                    including natural disasters, acts of government, strikes, or technical failures.
                </p>

                <h3 className='text-xl font-medium mt-6 mb-2'>15.10 Language</h3>
                <p>If these Terms are translated into other languages, the English version controls in case of conflicts.</p>
            </section>

            <section className='mb-8'>
                <h2 className='text-2xl font-semibold mb-3'>16. CONTACT INFORMATION</h2>
                <p className='mb-4'>For questions, concerns, or notices regarding these Terms, please contact us:</p>
                
                <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                        <h4 className='font-semibold mb-2'>General Inquiries:</h4>
                        <ul className='space-y-1 text-gray-700'>
                            <li><strong>Email:</strong> support@shippingminds.com</li>
                            <li><strong>Address:</strong> Lancaster City, Pennsylvania United States (EST)</li>
                            <li><strong>Phone:</strong> 717-371-4874</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Specialized Contact:</h4>
                        <ul className='space-y-1 text-gray-700'>
                            <li><strong>Legal Matters:</strong> legal@shippingminds.com</li>
                            <li><strong>Privacy Concerns:</strong> privacy@shippingminds.com</li>
                            <li><strong>Billing Issues:</strong> billing@shippingminds.com</li>
                        </ul>
                    </div>
                </div>
            </section>


        </div>
    )
}

export default TermsOfService