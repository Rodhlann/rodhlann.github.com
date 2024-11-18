
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { FaGithub, FaMastodon } from 'react-icons/fa';
import { LuBook, LuCode2, LuMail, LuTerminal, LuWaves } from 'react-icons/lu';

type Post = {
  title: string,
  link: string,
  pubDate: string
}

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  const projects = [
    {
      title: "RSS Reader",
      link: "https://rss-reader-next.vercel.app",
      description: "Modern take on content aggregation using React and Node.js",
      tags: ["typescript", "react", "rust"],
      type: "Web"
    },
    {
      title: "A* Search in JavaScript",
      link: "https://timpepper.dev/a-star",
      description: "Web-based pathfinding visualization with interactive controls",
      tags: ["typescript", "algorithms"],
      type: "Web"
    },
    {
      title: "A* Search in Rust",
      link: "https://github.com/Rodhlann/rust-astar",
      description: "High-performance pathfinding implementation showcasing Rust's memory safety and speed",
      tags: ["rust", "algorithms"],
      type: "Systems"
    },
    {
      title: "Snake Game in Rust",
      link: "https://github.com/Rodhlann/rust-snake",
      description: "Classic game rebuilt with modern Rust patterns and zero-cost abstractions",
      tags: ["rust", "games"],
      type: "Systems"
    },
  ];

  const fetchRSSFeed = async (): Promise<Post[]> => {
    try {
      const rssFeed = 'https://timpepper.dev/blog/posts/feed/rss.xml';
      const response = await fetch(rssFeed);
      const xml = await response.text();
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const items = doc.querySelectorAll('item');
      return [...items].slice(-5).map(item => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        return { title, link, pubDate };
      });
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchRSSFeed().then(posts => {
      console.log(posts);
      setPosts(posts);
    });
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-zinc-950 text-zinc-100 p-8">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-2">Tim Pepper</h1>
        <div className="flex items-center space-x-2 text-zinc-400 mb-6">
          <LuTerminal size={16} />
          <span>Software Team Lead</span>
          <span className="mx-2">•</span>
          <LuWaves size={16} />
          <span>Ocean Conservation Enthusiast</span>
        </div>
        
        <p className="text-lg text-zinc-300 mb-6">
          Full-stack developer with a decade of experience building products
          in TypeScript, React, and Node. Passionate about developer experience, 
          engineering culture, and ocean conservation. Most recently I have been 
          learning Rust, and am very excited to continue tinkering with it.
        </p>
        
        <div className="flex space-x-4">
          <a href="https://github.com/Rodhlann" 
             className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <FaGithub size={20} />
            <span>GitHub</span>
          </a>
          <a href="https://hachyderm.io/@rodhlann" 
             className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <FaMastodon size={20} />
            <span>Mastodon</span>
          </a>
          <a href="mailto:tim@timpepper.dev" 
             className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <LuMail size={20} />
            <span>Email</span>
          </a>
        </div>
      </header>

      {/* Featured Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <LuCode2 className="mr-2" />Featured Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardHeader>
              <a href={project.link}><CardTitle className="text-xl">{project.title}</CardTitle></a>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-zinc-800 border border-purple-400 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <LuBook className="mr-2" />Latest From the Blog
        </h2>
        
        
        {posts.map((post, index) => (
          <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors mb-6">
            <CardHeader>
              <a href={post.link}><CardTitle className="text-xl">{post.title}</CardTitle></a>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">{post.pubDate}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default App;
