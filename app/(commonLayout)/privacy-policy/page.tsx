"use client";

const terms = [
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

export default function TermsAndConditionPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] font-sans">

      {/* Hero Banner */}
      <div
        className="w-full flex flex-col items-center justify-center py-28 px-4"
        style={{
          background: "linear-gradient(135deg, #0f2942 0%, #1a4a7a 50%, #1e6ba8 100%)",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-blue-200 text-sm md:text-base text-center max-w-md">
          Privacy Policy you need to know for using this website.
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">

        {/* Section Title */}
        <h2 className="text-base font-bold text-gray-800 mb-5">
          All Privacy Policy
        </h2>

        {/* Terms List */}
        <div className="space-y-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-white rounded-lg px-5 py-4 border border-gray-100"
              style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-800 mr-1">
                  {index + 1}.
                </span>
                {term}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}