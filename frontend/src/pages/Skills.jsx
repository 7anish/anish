const Skills = () => {
  const chatData = [
    {
      question: "what are your technical skills?",
      skills: [
        {
          name: "C",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
          category: "Programming Language"
        },
        {
          name: "Java",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
          category: "Programming Language"
        },
        {
          name: "JavaScript",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          category: "Programming Language"
        },
        {
          name: "TypeScript",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
          category: "Programming Language"
        },
        {
          name: "HTML5",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
          category: "Markup Language"
        },
        {
          name: "CSS",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
          category: "Styling"
        },
        {
          name: "SQL",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
          category: "Database Query Language"
        },
        {
          name: "MongoDB",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
          category: "Database"
        },
        {
          name: "PostgreSQL",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
          category: "Database"
        },
        {
          name: "MySQL",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
          category: "Database"
        },
        {
          name: "Next.js",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
          category: "Frontend Framework"
        },
        {
          name: "React",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          category: "Frontend Library"
        },
        {
          name: "React Native",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          category: "Mobile Development"
        },
        {
          name: "Node.js",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
          category: "Backend Runtime"
        },
        {
          name: "Express.js",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
          category: "Backend Framework"
        },
        {
          name: "Prisma",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
          category: "ORM"
        },
        {
          name: "Tailwind CSS",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
          category: "CSS Framework"
        },
        {
          name: "Docker",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
          category: "DevOps"
        },
        {
          name: "Git",
          imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
          category: "Version Control"
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-[#212121] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {chatData.map((chat, chatIndex) => (
          <div key={chatIndex} className="space-y-6 mb-8">
            {/* User Question */}
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-[#2f2f2f] rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-base text-white">{chat.question}</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="max-w-[90%] w-full">
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 space-y-4">
                    {/* Intro Text */}
                    <p className="text-base text-gray-300 leading-relaxed mb-4">
                      Here are the <span className="font-semibold text-white">technical skills</span> and <span className="font-semibold text-white">technologies</span> Anish work with
                    </p>

                    <div className="h-[.5px] bg-white/30 "></div>

                    {/* Skills List */}
                    <div className="space-y-2">
                      {chat.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-4 p-3 bg-[#2a2a2a] hover:bg-[#2f2f2f] rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all duration-300 cursor-pointer"
                        >
                          {/* Skill Image */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white/5 rounded-lg p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <img
                              src={skill.imageUrl}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48?text=' + skill.name.charAt(0);
                              }}
                            />
                          </div>

                          {/* Skill Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-white transition-colors">
                              {skill.name}
                            </h3>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                              {skill.category}
                            </p>
                          </div>

                          {/* Proficiency Indicator */}
                          <div className="hidden sm:flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white transition-all duration-300"
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-[.5px] bg-white/30 sm:mt-10 mt-6"></div>

                    {/* Footer note */}
                    <p className="text-sm text-white pt-2">
                      Anish is always eager to learn new technologies and expand his skill set, so this list is constantly evolving as he explores new tools and frameworks in the tech world.
                    </p>
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

export default Skills;
