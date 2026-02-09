import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const Images = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample image gallery - replace with actual images
  const imageGallery = [
    {
      id: 1,
      title: 'Anish',
      url: '../me.webp',
      category: 'Me'
    },
    {
      id: 2,
      title: 'Innotech (Tech Team)',
      url: '../innotech.jpeg',
      category: 'Projects and Achievements'
    },
    {
      id: 3,
      title: 'BPlan (Winner)',
      url: '../bplan.jpg',
      category: 'Achievements'
    },
    {
      id: 5,
      title: 'Anveshna',
      url: '../anveshna.jpeg',
      category: 'Achievements'
    },
    {
      id: 6,
      title: 'Pick Deck (Runner-up)',
      url: '../greenpick.jpeg',
      category: 'Projects'
    },
  ];

  



  return (
    <div className="h-full bg-[#212121] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Image Gallery
          </h1>
          <p className="text-gray-400">
            View projects, certificates, and achievements
          </p>
        </div>

       

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {imageGallery.map((image) => (
            <div
              key={image.id}
              className="group relative break-inside-avoid mb-4 cursor-pointer"
              onClick={() => handleImageClick(image)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#2f2f2f] shadow-lg hover:shadow-2xl transition-all duration-300">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center px-4">
                    <ZoomIn className="w-8 h-8 mx-auto mb-2 text-white" />
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {image.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

    
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;
