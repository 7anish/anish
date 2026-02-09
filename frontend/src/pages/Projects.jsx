import { Link } from "lucide-react";

const Projects = () => {
  const chatData = [
    {
      question: "show me your recent projects",
      projects: [
        {
          "name": "Bharat Yaatri",
          "shortDescription": "A ride-booking platform designed to help drivers and passengers easily manage outstation and quick ride services.",
          "fullDescription": "Bharat Yaatri is a team-based ride service platform focused on simplifying driver availability and passenger bookings for both outstation and instant rides. Anish Kumar contributed primarily to backend development and the admin portal while also assisting in Flutter app improvements. The system includes ride management, driver coordination, booking workflows, and real-time operational handling through a centralized admin panel. Built with a scalable Node.js backend, React-based web interfaces, and a Flutter mobile application, the platform delivers a smooth experience for users and administrators.",
          "technologies": ["Node.js", "React", "Flutter", "REST APIs", "MongoDB", "Express js", "Git"],
          "screenshots": [
            "../bhyweb.png",
            "../bhyadmin.png",
          ],
          livelink: "https://play.google.com/store/apps/details?id=com.xcentic.bhy&pcampaignid=web_share",
          logo: '../bhylogo.webp'
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
                      Here are some of my <span className="font-semibold text-white">recent projects</span> that showcase my technical abilities and problem-solving skills:
                    </p>

                    <div className="h-[.5px] bg-white/30 "></div>

                    {/* Projects List */}
                    {chat.projects.map((project, projectIndex) => (
                      <div
                        key={projectIndex}
                        className="bg-[#2a2a2a] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all duration-300"
                      >
                        {/* Project Header */}
                        <div className="flex justify-start items-center px-2">
                          <img src={project.logo} alt={`${project.name} logo`} className="w-16 h-16 object-cover rounded-xl sm:flex hidden" />
                          <div className="sm:p-5 p-3 border-b border-gray-800/50">
                            <h3 className="text-lg font-bold text-white ">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {project.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Screenshots */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-[#1f1f1f]">
                          {project.screenshots.map((screenshot, screenshotIndex) => (
                            <div
                              key={screenshotIndex}
                              className="rounded-lg overflow-hidden border border-gray-800/30 hover:border-gray-700 transition-colors group"
                            >
                              <img
                                src={screenshot}
                                alt={`${project.name} screenshot ${screenshotIndex + 1}`}
                                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Technologies Used */}
                        <div className="p-5 border-t border-gray-800/50">
                          <h4 className="text-sm font-semibold text-white mb-3">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-[#1f1f1f] border border-gray-800/50 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:border-gray-700 transition-all duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                            {
                              project.livelink && (
                                <a
                                  href={project.livelink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-[#1f1f1f] border border-gray-800/50 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:border-gray-700 transition-all duration-200 flex items-center gap-1"
                                >
                                  <span className="-translate-y-0.5">Live Link</span>
                                  <Link size={12} />
                                </a>
                              )
                            }
                          </div>

                        </div>

                        {/* Full Description */}
                        <div className="p-5 border-t border-gray-800/50">
                          <h4 className="text-sm font-semibold text-white mb-3">
                            Project Details
                          </h4>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {project.fullDescription}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="h-[.5px] bg-white/30 "></div>

                    {/* Footer note */}
                    <p className="text-sm text-gray-500 pt-2">
                      Each project was built with a focus on scalability, user experience, and best practices. Feel free to reach out if you'd like to discuss any of these projects in detail!
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

export default Projects;
