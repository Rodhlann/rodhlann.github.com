import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaMastodon } from 'react-icons/fa';
import { LuMail } from 'react-icons/lu';

type Item = {
  name: string;
  desc: string;
  tags: string[];
  link: string;
  date?: string;
};

const delays: Record<string, { header: number; content: number }> = {
  header: { header: 600, content: 0 },
  profile: { header: 200, content: 300 },
  contact: { header: 200, content: 300 },
  projects: { header: 200, content: 300 },
  blog: { header: 200, content: 300 },
};

const projects: Item[] = [
  {
    name: "RSS Reader",
    link: "https://rss-reader-next.vercel.app",
    desc: "Modern take on content aggregation using React and Node.js",
    tags: ["typescript", "react", "rust"],
  },
  {
    name: "A* Search in JavaScript",
    link: "https://timpepper.dev/a-star",
    desc: "Web-based pathfinding visualization with interactive controls",
    tags: ["javascript", "algorithms"],
  },
  {
    name: "A* Search in Rust",
    link: "https://github.com/Rodhlann/rust-astar",
    desc: "High-performance pathfinding implementation showcasing Rust's memory safety and speed",
    tags: ["rust", "algorithms"],
  },
  {
    name: "Snake Game in Rust",
    link: "https://github.com/Rodhlann/rust-snake",
    desc: "Classic game rebuilt with modern Rust patterns and zero-cost abstractions",
    tags: ["rust", "games"],
  },
];

// Utility function to fetch RSS feed
const fetchRSSFeed = async (): Promise<Item[]> => {
  try {
    const rssFeed = 'https://timpepper.dev/blog/posts/feed/rss.xml';
    const response = await fetch(rssFeed);
    const xml = await response.text();
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const items = doc.querySelectorAll('item');

    return Array.from(items).slice(0, 3).map(item => ({
      name: item.querySelector('title')?.textContent || '',
      desc: item.querySelector('description')?.textContent || '',
      tags: item.querySelector('category')?.textContent?.split(',') || [],
      link: item.querySelector('link')?.textContent || '',
      date: item.querySelector('pubDate')?.textContent || '',
    }));
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

// Separator Component
const Separator: React.FC = () => (
  <div className="h-px mt-4 mb-4 ml-4 relative overflow-hidden first:mt-0 last:mb-0">
    <div className="absolute inset-0 bg-gradient-to-r from-turquoise/50 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
  </div>
);

// Tag Component
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-gray-950 text-xs text-turquoise border border-purple-500/30 px-2 py-1 rounded-sm mr-2 mb-2 inline-block">
    {children}
  </span>
);

// Card Component
const Card: React.FC<{ item: Item }> = ({ item }) => (
  <div className="card-container border border-purple-700/30 bg-gray-950 p-4 rounded-md hover:border-turquoise/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(64,224,208,0.15)] group">
    <h3 className="text-purple-100 transition-colors duration-300 mb-2 font-semibold">
      <a className="underline-on-card-hover" href={item.link}>{item.name}</a>
    </h3>
    <p className="text-gray-300 mb-3 text-sm">{item.desc}</p>
    <div className="flex flex-wrap">
      {item.tags.map(tag => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  </div>
);

// CommandBlock Component
type CommandBlockProps = {
  command: string;
  children?: React.ReactNode;
  headerVisible: boolean;
  contentVisible: boolean;
  header?: boolean;
};

const CommandBlock: React.FC<CommandBlockProps> = ({ command, children, headerVisible, contentVisible, header }) => {
  const [commandPrefix, commandSuffix] = command.split('/');

  return (
    <div className="group mb-4">
      {headerVisible && (
        <>
          <Separator />
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-turquoise/70">❯</div>
            <div className="text-purple-300">
              {header ? (
                <span className="text-xl font-semibold">
                  <span>{commandPrefix}/</span>
                  <span className="text-turquoise">{commandSuffix}</span>
                </span>
              ) : (
                command
              )}
            </div>
          </div>
          <div className={`pl-4 ${contentVisible ? 'animate-fadeIn' : 'hidden'}`}>
            {children}
          </div>
          <Separator />
        </>
      )}
    </div>
  );
};


// Main App Component
const App: React.FC = () => {
  const [posts, setPosts] = useState<Item[]>([]);
  const [visibleSections, setVisibleSections] = useState<Record<string, { header: boolean; content: boolean }>>({
    header: { header: false, content: false },
    profile: { header: false, content: false },
    contact: { header: false, content: false },
    projects: { header: false, content: false },
    blog: { header: false, content: false },
  });

  useEffect(() => {
    const loadSectionsSequentially = async () => {
      for (const [section, { header, content }] of Object.entries(delays)) {
        // Show header for the section after the specified delay
        await new Promise((resolve) => setTimeout(resolve, header));
        setVisibleSections((prev) => ({
          ...prev,
          [section]: { ...prev[section], header: true },
        }));
  
        // Show content for the section after the specified delay
        await new Promise((resolve) => setTimeout(resolve, content - header));
        setVisibleSections((prev) => ({
          ...prev,
          [section]: { ...prev[section], content: true },
        }));
      }
    };
  
    loadSectionsSequentially();
  }, []);

  useEffect(() => {
    fetchRSSFeed().then(setPosts);
  }, []);

  return (
    <div className="bg-gray-950 text-gray-300 p-6 min-h-screen font-mono pt-0 md:pt-6">
      <div className="max-w-3xl mx-auto">
        <CommandBlock 
          command="cd ~/timpepper_dev" 
          headerVisible={visibleSections.profile.header}
          contentVisible={false} 
          header 
        />

        <div className="space-y-4">
          <CommandBlock
            command="cat profile.txt"
            headerVisible={visibleSections.profile.header}
            contentVisible={visibleSections.profile.content}
          >
            <div className="text-2xl mb-4 text-purple-200 font-semibold">Tim Pepper</div>
            <div className="text-turquoise mb-4 text-sm tracking-wide">
              Software Team Lead <span className="text-gray-300">•</span> Marine Conservation Enthusiast
            </div>
            <p className="text-gray-300 leading-relaxed">
              Full-stack developer with a decade of experience building products in TypeScript, React, and Node.
              Passionate about developer experience, engineering culture, and ocean conservation.
              Currently exploring Rust and excited about its potential.
            </p>
          </CommandBlock>

          <CommandBlock
            command="cat contact.txt"
            headerVisible={visibleSections.contact.header}
            contentVisible={visibleSections.contact.content}
          >
            <div className="flex space-x-6">
              <a href="https://github.com/rodhlann" className="text-purple-300 hover:text-turquoise transition-colors duration-300 flex items-center space-x-1">
                <FaGithub />
                <span className='hover:underline text-gray-300'>GitHub</span>
              </a>
              <a href="https://hachyderm.io/@rodhlann" className="text-purple-300 hover:text-turquoise transition-colors duration-300 flex items-center space-x-1">
                <FaMastodon />
                <span className='hover:underline text-gray-300'>Mastodon</span>
              </a>
              <a href="https://www.linkedin.com/in/tim-pepper-8656a36b/" className="text-purple-300 hover:text-turquoise transition-colors duration-300 flex items-center space-x-1">
                <FaLinkedin />
                <span className='hover:underline text-gray-300'>LinkedIn</span>
              </a>
              <a href="mailto:tim@timpepper.dev" className="text-purple-300 hover:text-turquoise transition-colors duration-300 flex items-center space-x-1">
                <LuMail />
                <span className='hover:underline text-gray-300'>Email</span>
              </a>
            </div>
          </CommandBlock>

          <CommandBlock
            command="ls ./projects"
            headerVisible={visibleSections.projects.header}
            contentVisible={visibleSections.projects.content}
          >
            <div className="grid gap-4">
              {projects.map(project => (
                <Card key={project.name} item={project} />
              ))}
            </div>
          </CommandBlock>

          <CommandBlock
            command="ls ./blog/latest"
            headerVisible={visibleSections.blog.header}
            contentVisible={visibleSections.blog.content}
          >
            <div className="grid gap-4">
              {posts.map(post => (
                <Card key={post.name} item={post} />
              ))}
            </div>
          </CommandBlock>

          <div className="flex items-center space-x-2">
            <span className="text-turquoise/70">❯</span>
            <span className="blinking-cursor">█</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
