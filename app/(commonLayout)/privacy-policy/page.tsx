import ReuseableHeroWithoutImage from '@/components/sections/ReuseableHeroWithoutImage'
import React from 'react'

const privacyPolicies = [
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
];

const PrivacyPolicyPage = () => {
  return (
    <>
      <ReuseableHeroWithoutImage 
        title="Privacy Policy" 
        description="Privacy Policy you need to know for using this website." 
      />
      <section className='bg-[#F8FAFC] py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <h2 className='text-xl md:text-2xl font-bold text-[#1E293B] mb-10'>
            All Privacy Policy
          </h2>
          <div className='space-y-4'>
            {privacyPolicies.map((policy, index) => (
              <div 
                key={index} 
                className='bg-white p-6 md:p-8 border border-[#e2e8f08c]'
              >
                <p className='text-[#334155] leading-relaxed text-[15px] md:text-base'>
                  <span className='font-semibold mr-1'>{index + 1}.</span> {policy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}


export default PrivacyPolicyPage