const WorkExperience = () => {
  const chatData = [
    {
      question: "Tell me about Anish's work experience",
      experiences: [
        {
          company: "XCENTIC Technology",
          position: "Full Stack & DevOps Engineer",
          duration: "September 2025 - Present",
          location: "Full Time",
          description: "At XCENTIC Technology, Anish Kumar works as a Full Stack and DevOps Engineer, building and maintaining scalable web and mobile applications using modern technologies such as Next.js, Node.js, and React Native.",
          responsibilities: [
            "Designing backend architectures and developing robust APIs",
            "Managing databases and ensuring efficient data handling",
            "Deploying production-ready systems on cloud and VPS environments",
            "Performance optimization of applications and infrastructure",
            "Automation of deployment workflows and CI/CD pipelines",
            "Server management and ensuring application reliability through efficient DevOps practices"
          ],
          technologies: ["Next.js", "Node.js", "React Native", "Docker", "DevOps", "Cloud", "VPS"],
          achievements: [
            "Successfully deployed multiple production-ready applications",
            "Implemented automated deployment workflows improving team efficiency",
            "Built and maintained scalable web and mobile applications"
          ]
        },
        {
          company: "XCENTIC Technology",
          position: "Full Stack & DevOps Engineer",
          duration: "October 2023 - June 2024",
          location: "Internship (8 Months)",
          description: "During his internship at XCENTIC Technology, Anish gained hands-on experience in full-stack development and real-world software delivery.",
          responsibilities: [
            "Built business-focused applications from concept to deployment",
            "Worked on frontend interfaces using modern frameworks",
            "Developed backend logic and API integrations",
            "Assisted in deployment and server configuration tasks",
            "Collaborated with engineering team on version control workflows",
            "Contributed to scalable system design and architecture decisions"
          ],
          technologies: ["React", "Node.js", "Express", "MongoDB", "Git", "Server Management"],
          achievements: [
            "Strengthened understanding of scalable system design",
            "Successfully contributed to multiple business applications",
            "Gained real-world experience in collaborative development within a professional engineering team"
          ]
        },
        {
          company: "Stayz Pvt. Ltd.",
          position: "Frontend Developer",
          duration: "2 Months",
          location: "Internship",
          description: "At Stayz Pvt. Ltd., Anish worked as a Frontend Developer intern, focusing on building responsive and user-friendly web interfaces.",
          responsibilities: [
            "Built responsive and user-friendly web interfaces",
            "Collaborated with designers and backend developers to implement modern UI components",
            "Improved user experience through intuitive design implementations",
            "Ensured cross-device compatibility and responsive design",
            "Participated in team-based workflows and product development"
          ],
          technologies: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"],
          achievements: [
            "Strengthened frontend development skills",
            "Gained exposure to real-world product development",
            "Successfully delivered modern UI components with cross-device compatibility"
          ]
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-[#212121] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {chatData.map((chat, chatIndex) => (
          <div key={chatIndex} className="space-y-6">
            {/* User Question */}
            <div className="flex justify-end mb-6">
              <div className="max-w-[80%] bg-[#2f2f2f] rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-base text-white">{chat.question}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start mb-8">
              <div className="max-w-[90%] w-full">
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 space-y-8">
                    {/* Intro */}
                    <p className="text-base text-gray-300 leading-relaxed">
                      Anish has <span className="font-semibold text-white">professional experience</span> working across various roles and technologies. Here's a detailed overview of his work journey:
                    </p>

                    <div className="h-[.5px] bg-white/30 "></div>

                    {/* Experience List */}
                    {chat.experiences.map((exp, expIndex) => (
                      <div key={expIndex} className="space-y-4">
                        {/* Company & Position */}
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                          <p className="text-base text-white/80">{exp.position} • {exp.duration} • {exp.location}</p>
                          <p className="text-sm text-white/80 mt-2">{exp.description}</p>
                        </div>

                        {/* All Details as Bullet Points */}
                        <div className="ml-4 space-y-2">
                          {/* Responsibilities */}
                          {exp.responsibilities.map((resp, respIndex) => (
                            <div key={respIndex} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-white mt-1">•</span>
                              <span className="flex-1">{resp}</span>
                            </div>
                          ))}
                          
                          {/* Technologies as bullet point */}
                          <div className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-white mt-1">•</span>
                            <span className="flex-1">
                              <span className="text-white">Technologies:</span> {exp.technologies.join(', ')}
                            </span>
                          </div>

                          {/* Achievements */}
                          {exp.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-white mt-1">•</span>
                              <span className="flex-1">{achievement}</span>
                            </div>
                          ))}
                        </div>

                        {/* Divider between experiences */}
                        {expIndex < chat.experiences.length - 1 && (
                          <div className="h-[1px] bg-white/20 my-6"></div>
                        )}
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

export default WorkExperience;
