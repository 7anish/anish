import { X, Github, Linkedin, Twitter, Mail, Instagram, Globe, ExternalLink , Smile } from 'lucide-react';

const SocialLinksModal = ({ isOpen, onClose }) => {
  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      url: 'https://github.com/7anish', 
      color: 'text-gray-300',
      bgColor: 'bg-gray-800/50',
      hoverColor: 'hover:bg-gray-700/50',
      description: 'View my code repositories'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/in/7anish/', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      hoverColor: 'hover:bg-blue-800/40',
      description: 'Connect professionally'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: 'https://x.com/anissh96', 
      color: 'text-sky-400',
      bgColor: 'bg-sky-900/30',
      hoverColor: 'hover:bg-sky-800/40',
      description: 'Follow for updates'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/__anish_kr_/', 
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/30',
      hoverColor: 'hover:bg-pink-800/40',
      description: 'Check out my stories'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      url: 'mailto:anissh946@gmail.com', 
      color: 'text-red-400',
      bgColor: 'bg-red-900/30',
      hoverColor: 'hover:bg-red-800/40',
      description: 'Send me a message'
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-28 px-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#2a2a2a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white ">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Connect with me</h2>
              <p className="text-xs text-gray-400">Find me on these platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-4 rounded-xl bg-[#1f1f1f] hover:${link.bgColor} border border-white/20 hover:border-white/60 transition-all duration-300 cursor-pointer`}
                  onClick={onClose}
                >
                  <div className="relative">
                    <Icon className={`w-7 h-7 grayscale group-hover:grayscale-0 ${link.color} transition-all duration-300`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {link.description} {link.name === 'Email' && <span className="text-white font-semibold"> anissh946@gmail.com</span>}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${link.bgColor} border border-gray-700`}>
                      <ExternalLink className={`w-4 h-4 ${link.color} transition-colors`} />
                    </div>
                  </div>
                </a>
              );
            })}
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1f1f1f] border-t border-gray-800/50">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            Feel free to reach out on any platform. I'm always happy to connect! 
            <Smile size={14} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksModal;
