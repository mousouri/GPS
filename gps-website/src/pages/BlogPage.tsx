import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Calendar, Clock, Tag, User, Search,
  ChevronLeft, ChevronRight, BookOpen,
} from 'lucide-react';

const categories = ['All', 'Product Updates', 'Industry News', 'Tutorials', 'Case Studies', 'Company'];

const posts = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Fleet Management in 2024',
    excerpt: 'Discover how artificial intelligence is transforming the way companies manage their vehicle fleets, from predictive maintenance to route optimization.',
    image: '/images/robot-ai.jpg',
    category: 'Industry News',
    author: 'Sarah Mitchell',
    avatar: '/images/person-woman-4.jpg',
    date: 'Dec 20, 2024',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'TrackPro 3.0: Real-time Analytics Dashboard',
    excerpt: 'We\'re excited to announce the launch of our new analytics dashboard with real-time fleet insights, custom reports, and advanced filtering.',
    image: '/images/dashboard-analytics.jpg',
    category: 'Product Updates',
    author: 'Mike Johnson',
    avatar: '/images/person-man-1.jpg',
    date: 'Dec 18, 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 3,
    title: 'Setting Up Geofences: A Complete Guide',
    excerpt: 'Learn how to create, manage, and optimize geofence zones to improve fleet security and operational efficiency with our step-by-step tutorial.',
    image: '/images/city-map.jpg',
    category: 'Tutorials',
    author: 'Emily Chen',
    avatar: '/images/person-woman-5.jpg',
    date: 'Dec 15, 2024',
    readTime: '12 min read',
    featured: false,
  },
  {
    id: 4,
    title: 'How Acme Corp Reduced Fuel Costs by 32%',
    excerpt: 'A deep dive into how Acme Corporation leveraged TrackPro\'s analytics to dramatically cut their fleet fuel expenses in just 6 months.',
    image: '/images/tech-network.jpg',
    category: 'Case Studies',
    author: 'Rob Taylor',
    avatar: '/images/person-man-2.jpg',
    date: 'Dec 12, 2024',
    readTime: '10 min read',
    featured: false,
  },
  {
    id: 5,
    title: 'The Future of Connected Vehicles and IoT',
    excerpt: 'Exploring the emerging trends in connected vehicle technology and what it means for fleet management in the coming years.',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
    category: 'Industry News',
    author: 'Lisa Park',
    avatar: '/images/person-woman-2.jpg',
    date: 'Dec 10, 2024',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 6,
    title: 'TrackPro Expands to European Markets',
    excerpt: 'We\'re thrilled to announce our expansion into the European market, bringing advanced GPS tracking solutions to businesses across the EU.',
    image: '/images/city-night.jpg',
    category: 'Company',
    author: 'David Kim',
    avatar: '/images/person-man-3.jpg',
    date: 'Dec 8, 2024',
    readTime: '4 min read',
    featured: false,
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featured = posts.find((p) => p.featured);
  const rest = filteredPosts.filter((p) => !p.featured || activeCategory !== 'All');

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-400" />
            <span className="text-primary-400 font-medium text-sm">Blog & News</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Insights & <span className="gradient-text">Updates</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto mb-8">
            Stay up to date with the latest in fleet management, GPS technology, and TrackPro product updates.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search articles..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/10" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary-500 text-dark-950 shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {featured && activeCategory === 'All' && !searchQuery && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-3xl border border-white/5 overflow-hidden mb-10 group cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img src={featured.image} alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary-500 text-dark-950 text-xs font-medium rounded-full">Featured</span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-primary-400 text-sm font-medium mb-2">{featured.category}</span>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{featured.title}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={featured.avatar} alt={featured.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm text-white">{featured.author}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" /> {featured.date}
                        <span>•</span>
                        <Clock className="w-3 h-3" /> {featured.readTime}
                      </div>
                    </div>
                  </div>
                  <span className="text-primary-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden group cursor-pointer hover:border-primary-500/20 transition-colors"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-dark-950/80 backdrop-blur text-xs text-white rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3 text-primary-400" />
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-gray-400">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button className="px-4 py-2 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium">1</button>
          <button className="px-4 py-2 glass rounded-xl text-sm text-gray-400 hover:bg-white/10 transition-colors">2</button>
          <button className="px-4 py-2 glass rounded-xl text-sm text-gray-400 hover:bg-white/10 transition-colors">3</button>
          <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
