import { useEffect, useRef, useState, createContext, useContext } from 'react';
import {
  FaUser,
  FaBriefcase,
  FaTools,
  FaInfoCircle,
  FaProjectDiagram,
  FaEnvelope,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import './App.css';

// Color mode context
const ColorModeContext = createContext();

function useColorMode() {
  return useContext(ColorModeContext);
}

function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('color-mode') || 'dark'
  );
  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem('color-mode', mode);
  }, [mode]);
  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      {children}
    </ColorModeContext.Provider>
  );
}

function getAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const skills = [
  'Javascript',
  'C#',
  'ReactJS',
  'MySQL',
  'TypeScript',
  'PHP',
  'WordPress',
  'React Native',
  'Firebase',
  'Unity',
  'Flutter',
];

const projects = [
  {
    name: 'IndoChili Restaurant',
    url: 'https://www.indochili.com',
    img: '/indochili.png',
    icon: '/indochili-icon.png',
    desc: 'Authentic Indonesian cuisine in Singapore, rated 4.5/5 by 8 Days Magazine. Modern, responsive restaurant website with menu, reservation, and contact features.',
  },
  {
    name: 'Bright Hill Evergreen Home',
    url: 'https://www.bheh.org',
    img: '/bheh.png',
    icon: '/bheh-icon.webp',
    desc: 'Charity and eldercare organization in Singapore. Website features information on services, support, media, and volunteer opportunities.',
  },
  {
    name: 'Eureka Singapore',
    url: 'https://eurekasingapore.com.sg',
    img: '/eureka.png',
    icon: '/eureka-icon.png',
    desc: 'Corporate and business solutions provider. Website highlights services, company profile, and contact information for clients in Singapore.',
  },
  {
    name: `Children's Vineyard`,
    url: 'https://childrensvineyard.com',
    img: '/childrensvineyard.png',
    icon: '/childrensvineyard-icon.png',
    desc: `Educational and community-focused organization. Website provides resources, event info, and support for children and families.`,
  },
  {
    name: 'Quantum Shorts',
    url: 'https://shorts.quantumlah.org/',
    img: '/quantum.png',
    icon: '/quantum-logo.png',
    desc: 'International quantum-themed short film festival and flash fiction competition. Features event info, archives, and resources for quantum creativity.',
  },
  {
    name: 'Untarun',
    url: 'https://untarun.itch.io/untarun',
    img: '/untarun.png',
    icon: '/untarun-logo.png',
    desc: 'A 2D endless runner game about a boy who is trying to finish his thesis.',
  },
];

function useParallaxCursor() {
  const cursorRef = useRef();
  const heroNameRef = useRef();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let cursor = { x: mouse.x, y: mouse.y };
    let name = { x: 0, y: 0 };
    let running = true;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onKeyDown = (e) => {
      if (e.key === 't' || e.key === 'T') setIsAnimating((v) => !v);
    };
    const onClick = () => setIsAnimating(true);

    function animate() {
      if (!running) return;
      // Cursor
      cursor.x += (mouse.x - cursor.x) * 0.25;
      cursor.y += (mouse.y - cursor.y) * 0.25;
      if (cursorRef.current && isAnimating) {
        cursorRef.current.style.left = cursor.x - 10 + 'px';
        cursorRef.current.style.top = cursor.y - 10 + 'px';
        cursorRef.current.style.opacity = '1';
      } else if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
      // Parallax
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      name.x += (dx * 0.02 - name.x) * 0.18;
      name.y += (dy * 0.02 - name.y) * 0.18;
      if (heroNameRef.current && isAnimating) {
        heroNameRef.current.style.transform = `translate(${name.x}px, ${name.y}px)`;
      } else if (heroNameRef.current) {
        heroNameRef.current.style.transform = 'none';
      }
      requestAnimationFrame(animate);
    }
    running = true;
    requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);
    return () => {
      running = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
    };
  }, [isAnimating]);

  return { cursorRef, heroNameRef, isAnimating };
}

function useSectionHeaderAnimation() {
  useEffect(() => {
    const headers = document.querySelectorAll('.section-header');
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('header-visible');
            entry.target.classList.remove('header-hidden');
          } else {
            entry.target.classList.remove('header-visible');
            entry.target.classList.add('header-hidden');
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    headers.forEach((header) => observer.observe(header));
    return () => observer.disconnect();
  }, []);
}

function useBubblyEffect() {
  const [bubbles, setBubbles] = useState([]);
  const portfolioRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const animationId = useRef(null);

  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      startBubbleAnimation();
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };

    const startBubbleAnimation = () => {
      const createBubble = () => {
        if (!isHovering.current) return;

        const newBubble = {
          id: Date.now() + Math.random(),
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: Math.random() * 15 + 8,
          opacity: Math.random() * 0.6 + 0.4
        };
        
        setBubbles(prev => {
          const updatedBubbles = [...prev, newBubble];
          return updatedBubbles.slice(-20);
        });
        
        setTimeout(() => {
          setBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
        }, 2000);

        animationId.current = requestAnimationFrame(createBubble);
      };

      animationId.current = requestAnimationFrame(createBubble);
    };

    portfolio.addEventListener('mousemove', handleMouseMove);
    portfolio.addEventListener('mouseenter', handleMouseEnter);
    portfolio.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      portfolio.removeEventListener('mousemove', handleMouseMove);
      portfolio.removeEventListener('mouseenter', handleMouseEnter);
      portfolio.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return { bubbles, portfolioRef };
}

function SidebarNav() {
  const { mode, toggle } = useColorMode();
  const navItems = [
    { href: '#profile', icon: <FaUser />, label: 'Profile' },
    { href: '#experience', icon: <FaBriefcase />, label: 'Experiences' },
    { href: '#skills', icon: <FaTools />, label: 'Skills' },
    { href: '#about', icon: <FaInfoCircle />, label: 'About' },
    { href: '#portfolio', icon: <FaProjectDiagram />, label: 'Portfolio' },
    { href: '#contact', icon: <FaEnvelope />, label: 'Contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerOffset = 0; // No offset to position header at the very top
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="sidebar-nav">
      <div 
        className="sidebar-title"
        onClick={(e) => handleNavClick(e, '#hero')}
        style={{ cursor: 'pointer' }}
      >
        Audric Clarence Jovan
      </div>
      <ul className="sidebar-menu">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="sidebar-link"
              title={item.label}
              aria-label={item.label}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <button
        className="color-mode-toggle"
        onClick={toggle}
        aria-label="Toggle color mode"
      >
        {mode === 'dark' ? <FaSun /> : <FaMoon />}
      </button>
    </aside>
  );
}

function App() {
  const age = getAge('2000-05-17');
  const { cursorRef, heroNameRef, isAnimating } =
    useParallaxCursor();
  const { bubbles, portfolioRef } = useBubblyEffect();
  useSectionHeaderAnimation();

  return (
    <ColorModeProvider>
      <AppContent age={age} cursorRef={cursorRef} heroNameRef={heroNameRef} isAnimating={isAnimating} bubbles={bubbles} portfolioRef={portfolioRef} />
    </ColorModeProvider>
  );
}

function AppContent({ age, cursorRef, heroNameRef, isAnimating, bubbles, portfolioRef }) {
  const { mode } = useColorMode();
  
  return (
    <div className="main-bg">
        {/* Mouse cursor effect */}
        <div ref={cursorRef} className="mouse-cursor"></div>
        {/* Background particles for entire website */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationPlayState: isAnimating ? 'running' : 'paused',
              }}
            ></div>
          ))}
        </div>
        {/* Sidebar Navigation */}
        <SidebarNav />
        {/* Hero Section */}
        <header id="hero" className="hero">
          {/* Video Background */}
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            key={mode}
            onError={(e) => {
              console.log('Video failed to load - please check Google Drive sharing settings');
              // Fallback to a gradient background if video fails
              e.target.style.display = 'none';
              e.target.parentElement.style.background = mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e0 100%)';
            }}
          >
            <source src={mode === 'dark' ? "https://drive.google.com/uc?export=download&id=1eo2M-fgt3a_4c0lR8Fr2pDNBrGsHOdFi" : "https://drive.google.com/uc?export=download&id=1RpEPKD0IrlGLcRl_gnGEF3hos-nYRA0R"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={`hero-overlay ${mode === 'light' ? 'hero-overlay-light' : ''}`}></div>
          {/* Additional particles on top of hero video */}
          <div className="hero-particles-container">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationPlayState: isAnimating ? 'running' : 'paused',
                }}
              ></div>
            ))}
          </div>
          <div className="hero-container">
            <div className="hero-content">
              <p className="hero-intro">Hi, I am</p>
              <h1 ref={heroNameRef} className="hero-name">
                Audric Clarence Jovan
              </h1>
              <p className="hero-title">I am a Web Developer 🧑‍💻</p>
              <div className="hero-buttons">
                <a href="/resume.pdf" download className="btn-primary">
                  View my resume
                </a>
                <a href="#portfolio" className="btn-secondary">
                  See my projects
                </a>
              </div>
            </div>
          </div>
        </header>
        {/* Profile Section */}
        <section id="profile" className="profile-section">
          <div className="section-container">
            <h2 className="section-header">-- Profile --</h2>
            <div className="profile-content">
              <div className="profile-info">
                <p>
                  <strong>Name:</strong> Audric Clarence Jovan
                </p>
                <p>
                  <strong>Age:</strong> {age}
                </p>
                {/* <p><strong>Current Job:</strong> Web Developer at Closely Coded Pte Ltd (Singapore)</p>
                <p><strong>Education:</strong> Tarumanagara University</p> */}
                <p>
                  <strong>Degree:</strong> Bachelor's in Computer Science
                </p>
              </div>
              <div className="profile-contact">
                <h3>Reach me by:</h3>
                <div className="contact-links">
                  <a href="tel:+6281905127008" className="contact-link">
                    Phone
                  </a>
                  <a href="mailto:audric678@gmail.com" className="contact-link">
                    Email
                  </a>
                  <a
                    href="https://www.linkedin.com/in/audric-clarence-jovan-361885134"
                    className="contact-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/linkedin-logo.svg"
                      alt="LinkedIn"
                      className="linkedin-logo"
                    />{' '}
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Experience Section */}
        <section id="experience" className="experience-section">
          <div className="section-container">
            <h2 className="section-header">-- Experiences --</h2>
            <div className="experience-list">
              <div className="experience-card">
                <img
                  src="/closelycoded-icon.png"
                  alt="Closely Coded Logo"
                  className="experience-logo"
                />
                <div className="experience-content">
                  <h3>Web Developer at Closely Coded Pte Ltd (Singapore)</h3>
                  <p>
                    <strong>2022 - Present</strong>
                  </p>
                  <p>
                    Closely Coded is a Singapore-based digital agency
                    specializing in web development, UI/UX design, and digital
                    solutions for businesses. As a Web Developer, I work on
                    building modern, scalable web applications and digital
                    products for clients across various industries.
                  </p>
                </div>
              </div>
              <div className="experience-card">
                <img
                  src="/kawan-lama-icon.png"
                  alt="Kawan Lama Logo"
                  className="experience-logo"
                />
                <div className="experience-content">
                  <h3>
                    Full Stack Developer Intern at PT Kawan Lama Sejahtera
                  </h3>
                  <p>
                    <strong>2021</strong>
                  </p>
                  <p>
                    PT Kawan Lama Sejahtera is a leading industrial supply
                    company in Indonesia, providing a wide range of products and
                    solutions for businesses. As a Full Stack Developer Intern,
                    I contributed to the development of internal tools and web
                    applications, collaborating with cross-functional teams to
                    deliver impactful solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Skills Section */}
        <section id="skills" className="skills-section">
          <div className="section-container">
            <h2 className="section-header">-- Skills --</h2>
            <div className="skills-list">
              {skills.map((skill, idx) => (
                <span
                  className="skill-tag"
                  key={idx}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    animationPlayState: isAnimating ? 'running' : 'paused',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-container">
            <h2 className="section-header">-- About --</h2>
            <div className="about-content">
              <p>
                I'm a Computer Science graduate from Tarumanagara University
                with a passion for web development and creating innovative
                digital solutions. I specialize in building responsive,
                user-friendly websites and applications that deliver exceptional
                user experiences.
              </p>
              {/* <div className="education">
                <div className="education-logo">
                  <img
                    src="/untar-logo.png"
                    alt="Tarumanagara University Logo"
                    className="education-logo-img"
                  />
                </div>
                <div className="education-content">
                  <h3>Education</h3>
                  <p>
                    <strong>Tarumanagara University</strong>
                  </p>
                  <p>Bachelor's Degree in Computer Science</p>
                </div>
                          
              </div> */}
            </div>
          </div>
        </section>
        {/* Portfolio Section */}
        <section id="portfolio" className="portfolio-section" ref={portfolioRef}>
          <div className="section-container">
            <h2 className="section-header">-- My Projects --</h2>
            {/* Bubbly Effects */}
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="bubble"
                style={{
                  left: bubble.x + 'px',
                  top: bubble.y + 'px',
                  width: bubble.size + 'px',
                  height: bubble.size + 'px',
                  opacity: bubble.opacity
                }}
              />
            ))}
            <div className="portfolio-list">
              {projects.map((project, idx) => (
                <div className="portfolio-card" key={project.name}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="portfolio-img-container">
                      <img
                        src={project.img}
                        alt={project.name}
                        className="portfolio-img"
                      />
                      <div className="portfolio-overlay">
                        <img
                          src={project.icon}
                          alt={project.name + ' Icon'}
                          className="portfolio-icon"
                        />
                      </div>
                    </div>
                    <div className="portfolio-content">
                      <h3>{project.name}</h3>
                      <p>{project.desc}</p>
                      <span className="portfolio-link">Visit Website →</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="section-container">
            <h2 className="section-header">-- Contact --</h2>
            <div className="contact-info">
              <div className="contact-item">
                <h3>Phone</h3>
                <a href="tel:+6281905127008">+62 819 0512 7008</a>
              </div>
              <div className="contact-item">
                <h3>Email</h3>
                <a href="mailto:audric678@gmail.com">audric678@gmail.com</a>
              </div>
            </div>
          </div>
        </section>
        {/* LinkedIn Section */}
        <section className="linkedin-section">
          <div className="section-container">
            <div className="linkedin-card">
              <img
                src="/linkedin-logo.svg"
                alt="LinkedIn Logo"
                className="linkedin-card-logo"
              />
              <div className="linkedin-card-content">
                <h3>Connect with me on LinkedIn</h3>
                <p>
                  Let's connect professionally! Visit my LinkedIn profile to see
                  my latest updates, endorsements, and professional network.
                </p>
                <a
                  href="https://www.linkedin.com/in/audric-clarence-jovan-361885134"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-linkedin"
                >
                  Visit LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="footer">
          <p>
            © {new Date().getFullYear()} Audric Clarence Jovan. All rights
            reserved.
          </p>
          <p className="footer-credits">
            Icons made by{' '}
            <a
              href="https://www.flaticon.com/authors/freepik"
              target="_blank"
              rel="noopener noreferrer"
            >
              Freepik
            </a>{' '}
            from{' '}
            <a
              href="https://www.flaticon.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.flaticon.com
            </a>
          </p>
        </footer>
      </div>
    );
  }

export default App;
