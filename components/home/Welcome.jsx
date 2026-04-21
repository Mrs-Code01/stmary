import React from "react";

const DirectorsWelcome = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      {/* Container: 90% width centered */}
      <div className="w-[90%] mx-auto">
        {/* Section Title */}
        <h2 className="text-[#334155] text-2xl md:text-[35px] font-bold mb-8 font-[var(--worksans-font)]">
          Director's Welcome Message
        </h2>

        {/* Content Body: Simple Paragraphs */}
        <div className="flex flex-col gap-8 text-[#334155] leading-relaxed text-base md:text-[22px] font-[var(--inter-font)]">
          <p>
            At St. Mary Educational Center, we believe education is more than
            academics — it is the complete development of the individual. Our
            mission is to help every student discover and nurture their unique
            talents, gain confidence, and prepare for meaningful participation
            in today's competitive world.
          </p>

          <p>
            We emphasize purposeful learning, high moral standards, and the
            cultivation of self-esteem through knowledge and skills that
            extend beyond the classroom.
          </p>

          <p>
            Since our founding, we have upheld a strong stand against exam
            malpractice, embraced the principle of individual differences, and
            provided a supportive environment where students excel according
            to their abilities.
          </p>

          <p>
            With a broad-based curriculum, modern facilities, and dedicated
            teachers, St. Mary Educational Center continues to rank among the region's
            most progressive and examination-friendly schools.
          </p>

          {/* Call to Action - Blue Text */}
          <p className="text-[#005FAC] font-bold text-lg md:text-[22px] mt-2">
            We warmly invite you to join us and give your child the opportunity
            to transform their potential into success.
          </p>
        </div>

        {/* Right Aligned Signature Section */}
        <div className="mt-16 flex flex-col items-end text-right">
          <div className="pt-6">
            <h4 className="text-[#334155] text-lg md:text-[22px] font-medium">
              - The Director
            </h4>
            <p className="text-gray-400 text-[17px] font-medium tracking-wide mt-1 italic">
              St. Mary Educational Center
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorsWelcome;
