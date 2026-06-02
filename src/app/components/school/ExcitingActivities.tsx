import { motion } from 'motion/react';
import { ArrowLeft, Palette, Rocket, Music, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ExcitingActivitiesProps {
  activityType: 'art-corner' | 'space-explorer' | 'music-time';
  onBack: () => void;
}

export function ExcitingActivities({ activityType, onBack }: ExcitingActivitiesProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const activities = {
    'art-corner': {
      title: 'Art Corner 🎨',
      subtitle: 'Create beautiful artwork!',
      color: 'from-red-400 to-pink-500',
      icon: Palette,
      items: [
        { id: 1, name: 'Color Mixing', emoji: '🎨', description: 'Learn how colors blend together!' },
        { id: 2, name: 'Draw Animals', emoji: '🐶', description: 'Learn to draw cute animals step by step!' },
        { id: 3, name: 'Shape Art', emoji: '⭐', description: 'Create art using basic shapes!' },
        { id: 4, name: 'Rainbow Painting', emoji: '🌈', description: 'Paint beautiful rainbows!' },
        { id: 5, name: 'Finger Painting', emoji: '👆', description: 'Create art with your fingers!' },
        { id: 6, name: 'Pattern Design', emoji: '🔷', description: 'Make cool patterns and designs!' },
      ],
    },
    'space-explorer': {
      title: 'Space Explorer 🚀',
      subtitle: 'Explore the universe!',
      color: 'from-indigo-400 to-purple-500',
      icon: Rocket,
      items: [
        { id: 1, name: 'Our Solar System', emoji: '☀️', description: 'Learn about planets and the sun!' },
        { id: 2, name: 'Moon Phases', emoji: '🌙', description: 'Discover how the moon changes!' },
        { id: 3, name: 'Stars & Galaxies', emoji: '⭐', description: 'Explore stars and the Milky Way!' },
        { id: 4, name: 'Astronauts', emoji: '👨‍🚀', description: 'Learn about space explorers!' },
        { id: 5, name: 'Rockets', emoji: '🚀', description: 'How do rockets fly to space?' },
        { id: 6, name: 'Alien Friends', emoji: '👽', description: 'Imagine life on other planets!' },
      ],
    },
    'music-time': {
      title: 'Music Time 🎵',
      subtitle: 'Play with sounds!',
      color: 'from-violet-400 to-fuchsia-500',
      icon: Music,
      items: [
        { id: 1, name: 'Rhythm Games', emoji: '🥁', description: 'Tap along to the beat!' },
        { id: 2, name: 'Musical Notes', emoji: '🎵', description: 'Learn Do, Re, Mi, Fa, Sol!' },
        { id: 3, name: 'Instruments', emoji: '🎸', description: 'Discover different instruments!' },
        { id: 4, name: 'Sound Patterns', emoji: '🔔', description: 'Create repeating sound patterns!' },
        { id: 5, name: 'Sing Along', emoji: '🎤', description: 'Sing fun educational songs!' },
        { id: 6, name: 'Music Games', emoji: '🎹', description: 'Play interactive music games!' },
      ],
    },
  };

  const activity = activities[activityType];
  const Icon = activity.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          
          <div className="flex-1">
            <h1 className="text-gray-900 flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              {activity.title}
            </h1>
            <p className="text-gray-600 mt-1">{activity.subtitle}</p>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activity.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedItem(item.id);
                (window as any).todaiSpeak?.(`Great choice! Let's explore ${item.name}!`);
              }}
              className={`relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer ${
                selectedItem === item.id ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              {/* Emoji Badge */}
              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg text-3xl"
                >
                  {item.emoji}
                </motion.div>
              </div>

              <div className="mt-8">
                <h3 className="text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 w-full py-2 bg-gradient-to-r ${activity.color} text-white rounded-xl shadow-md flex items-center justify-center gap-2`}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">Let's Go!</span>
              </motion.button>

              {/* Selected Indicator */}
              {selectedItem === item.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-3xl p-6 text-center"
        >
          <div className="text-4xl mb-3">🎉✨🚀</div>
          <h3 className="text-gray-900 mb-2">More Activities Coming Soon!</h3>
          <p className="text-gray-700">
            We're working on making these activities even more fun and interactive!
            Stay tuned for amazing updates! 🌟
          </p>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-gray-900 mb-4">Did You Know? 💡</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activityType === 'art-corner' && (
              <>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
                  <p className="text-sm text-gray-700">🎨 There are over 10 million colors that humans can see!</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                  <p className="text-sm text-gray-700">✨ The most expensive painting ever sold cost over $450 million!</p>
                </div>
              </>
            )}
            {activityType === 'space-explorer' && (
              <>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                  <p className="text-sm text-gray-700">🌟 There are more stars in space than grains of sand on Earth!</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                  <p className="text-sm text-gray-700">🚀 It takes about 3 days to travel to the Moon!</p>
                </div>
              </>
            )}
            {activityType === 'music-time' && (
              <>
                <div className="p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl">
                  <p className="text-sm text-gray-700">🎵 Music can make your heart beat faster or slower!</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                  <p className="text-sm text-gray-700">🎸 The oldest musical instrument is over 40,000 years old!</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
