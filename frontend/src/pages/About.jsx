const About = () => {
  const chatData = [
    {
      question: "Tell me about Anish in a professional and concise way",
      answer: {
        intro: "Here's a comprehensive overview of <strong>Anish Kumar</strong>, highlighting his expertise, experience, and approach to software development:",
        sections: [
          {
            title: "Professional Overview",
            paragraphs: [
              "<strong>Anish Kumar</strong> is a full-stack developer who focuses on building practical technology that solves real-world problems. He mainly works with <strong>Next.js</strong>, <strong>Node.js</strong>, <strong>React Native</strong>, and modern databases, creating scalable and efficient applications with a strong focus on performance and clean architecture. His development approach combines strong backend logic with intuitive user experiences to deliver reliable digital solutions.",
              "He has worked on several projects that support real businesses and operational workflows, including <strong>management systems</strong>, <strong>ERP modules</strong>, <strong>automation tools</strong>, and <strong>AI-driven applications</strong>. His experience covers the complete development lifecycle — from planning and development to deployment and system optimization — helping organizations streamline processes and improve efficiency through technology.",
              "Anish builds software with both security and scalability in mind. He is constantly exploring new technologies, experimenting with innovative ideas, and developing systems that automate tasks and solve meaningful challenges."
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="h-full bg-[#212121] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {chatData.map((chat, chatIndex) => (
          <div key={chatIndex} className="space-y-6 mb-8">
            {/* User Question */}
            <div className="flex justify-end sm:mb-16 mb-8">
              <div className="max-w-[80%] bg-[#2f2f2f] rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-base text-white">{chat.question}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="max-w-[90%] space-y-8">
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 space-y-6">
                    {/* Intro */}
                    <p 
                      className="text-base text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: chat.answer.intro.replace(/<strong>/g, '<span class="font-semibold text-white">').replace(/<\/strong>/g, '</span>')
                      }}
                    />

                    <div className="h-[.5px] bg-white/30 "></div>

                    {/* Sections */}
                    {chat.answer.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <h3 className="text-base font-bold text-white">
                            {section.title}
                          </h3>
                        </div>

                        <div className="space-y-4 text-gray-300 leading-relaxed">
                          {section.paragraphs.map((paragraph, paragraphIndex) => (
                            <p 
                              key={paragraphIndex}
                              className="text-base"
                              dangerouslySetInnerHTML={{ 
                                __html: paragraph.replace(/<strong>/g, '<span class="font-semibold text-white">').replace(/<\/strong>/g, '</span>')
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
