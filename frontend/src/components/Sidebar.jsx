import {
    MessageSquarePlus,
    Search,
    FolderClosed,
    SquarePen,
    BrainCog,
    TextAlignJustify,
    Download,
    X,
    User,
    Award,
    Briefcase,
    Images,
    Loader2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, onClose, onOpenSocialLinks }) => {
    const location = useLocation();
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const chatHistory = [
        {
            title: 'About Anish',
            link : '/about'
        },
        {
            title: 'Skills of Anish',
            link : '/skills'
        },
        {
            title: 'Work experience of Anish',
            link : '/work-experience'
        },
        {
            title: 'Projects of Anish',
            link : '/projects'
        },
    ];

    // Fetch GitHub activities
    useEffect(() => {
        const fetchGitHubActivities = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://api.7anish.com/api/github/activities');
                const result = await response.json();
                
                if (result.success && result.data) {
                    setRecentActivities(result.data);
                } else {
                    // Set fallback activities if API fails
                    setRecentActivities([]);
                }
            } catch (error) {
                console.error('Error fetching GitHub activities:', error);
                // Set fallback activities
                setRecentActivities([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGitHubActivities();
    }, []);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static
                w-56 bg-[#1a1a1a] h-screen flex flex-col
                z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

            <div className="px-2 py-4">
                <div className="flex items-center gap-3 px-2 py-2 justify-between">
                    <Link to="/" onClick={onClose}>
                        <img src="https://github.com/7anish.png" alt="" className="rounded-full w-8 h-8 cursor-pointer border-2 border-white border-dashed" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <TextAlignJustify className="text-white cursor-pointer hidden lg:block" size={18} />
                        <button
                            onClick={onClose}
                            className="lg:hidden text-white hover:bg-white/10 p-1 rounded transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Top Section */}
            <div className="p-3 mb-4">
                <Link to='/' onClick={onClose} className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer ${location.pathname === '/' ? 'bg-white/10' : ''}`}>
                    <SquarePen className="text-white group-hover:text-white transition-colors" size={16} />
                    <span className="text-xs font-medium text-white group-hover:text-white">New chat</span>
                </Link>
                <button 
                    onClick={onOpenSocialLinks}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer"
                >
                    <Search className="text-white group-hover:text-white transition-colors" size={16} />
                    <span className="text-xs font-medium text-white group-hover:text-white">Social Links</span>
                </button> 
                <Link to='/images' onClick={onClose} className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer ${location.pathname === '/images' ? 'bg-white/10' : ''}`}>
                    <Images className="text-white group-hover:text-white transition-colors" size={16} />
                    <span className="text-xs font-medium text-white group-hover:text-white">Images</span>
                </Link>
            </div>

            
            <div className="mb-4 px-3">
                <div className="text-xs text-white/50 font-semibold mb-4 px-1 tracking-wider">Recent Activities</div>
                <div className="space-y-0.5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                        </div>
                    ) : recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-pointer"
                            >
                                <FolderClosed className="text-white group-hover:text-white transition-colors flex-shrink-0" size={16} />
                                <span className="text-xs font-medium text-white group-hover:text-white truncate capitalize ">
                                    {activity.repoName} ({activity.activityType})
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-white/50 px-2 py-2">No recent activities</p>
                    )}
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
                <div className="text-xs text-white/50 font-semibold mb-4 px-1 tracking-wider">Recent chats</div>
                <div className="space-y-0.5">
                    {chatHistory.map((chat, index) => (
                        <Link
                            key={index}
                            to={chat.link}
                            onClick={onClose}
                            className={`block px-2 py-2 text-xs hover:bg-white/5 rounded-lg transition-all duration-200 text-white hover:text-white truncate font-medium ${location.pathname === chat.link ? 'bg-white/10' : ''}`}
                        >
                            {chat.title}
                        </Link>
                    ))}
                </div>
            </div>

            <a className="px-3 py-4" href='../public/resume.pdf' target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-3 px-3 py-2 hover:bg-white/90 rounded-lg transition-all duration-200 group cursor-pointer mb-4 bg-white">
                    <Download className="text-black group-hover:text-black transition-colors" size={16} />
                    <span className="text-xs font-medium text-black group-hover:text-black">Get resume</span>
                </button>
            </a>
        </div>
        </>
    );
};

export default Sidebar;
