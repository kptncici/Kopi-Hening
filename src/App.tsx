import { useEffect, useRef, useState } from 'react';
import { 
  Coffee, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  Leaf, 
  ChevronDown,
  Send,
  MessageCircle
} from 'lucide-react';

// Typing animation hook
function useTypingEffect(text: string, speed: number = 100, delay: number = 0) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Blink cursor after typing
        const cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isTyping, text, speed]);

  return { displayText, showCursor };
}

// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Menu', href: '#menu' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Lokasi', href: '#lokasi' },
    { label: 'Kontak', href: '#kontak' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#beranda" className="flex items-center gap-2 group">
          <div className={`p-2 rounded-full transition-all duration-300 ${
            isScrolled ? 'bg-coffee-dark' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <Coffee className={`w-5 h-5 transition-colors ${
              isScrolled ? 'text-cream' : 'text-white'
            }`} />
          </div>
          <span className={`font-serif text-xl font-semibold tracking-wide transition-colors ${
            isScrolled ? 'text-coffee-dark' : 'text-white'
          }`}>
            Kopi Hening
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 hover:opacity-70 ${
                isScrolled ? 'text-coffee-dark' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isScrolled 
                ? 'bg-coffee-dark text-cream hover:bg-coffee-darker' 
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            Pesan
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isScrolled ? 'text-coffee-dark' : 'text-white'
          }`}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-coffee-dark' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-coffee-dark' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full transition-all ${isScrolled ? 'bg-coffee-dark' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-cream/98 backdrop-blur-lg shadow-lg transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-coffee-dark hover:text-coffee-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-4 bg-coffee-dark text-cream rounded-lg text-center mt-4"
          >
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const { displayText, showCursor } = useTypingEffect('Diam. Kopi. Tenang.', 120, 500);

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-darker/80 via-coffee-dark/70 to-coffee-darker/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1920&q=80" 
          alt="Coffee Shop Ambiance"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Coffee className="w-10 h-10 text-cream" />
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-6 tracking-tight">
          Kopi Hening
        </h1>
        
        <p className="text-xl md:text-2xl text-cream/90 font-light tracking-wide mb-4 h-8">
          {displayText}
          <span className={`inline-block w-0.5 h-6 bg-cream ml-1 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </p>

        <p className="text-cream/70 text-lg max-w-xl mx-auto mb-10">
          Ruang tenang di tengah hiruk pikuk kota. Nikmati kopi berkualitas dalam suasana yang menenangkan jiwa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#menu"
            className="px-8 py-4 bg-cream text-coffee-dark rounded-full font-medium hover:bg-white transition-all duration-300 hover:scale-105"
          >
            Lihat Menu
          </a>
          <a 
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-cream/50 text-cream rounded-full font-medium hover:bg-cream/10 transition-all duration-300"
          >
            Pesan Sekarang
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-8 h-8 text-cream/60" />
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="tentang" className="py-24 bg-cream">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-coffee-medium/30 rounded-lg" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-coffee-light/20 rounded-lg" />
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80" 
              alt="Tentang Kopi Hening"
              className="relative z-10 w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </div>
          
          <div>
            <span className="text-coffee-medium text-sm font-medium tracking-widest uppercase mb-4 block">
              Tentang Kami
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-dark mb-6">
              Tentang Kopi Hening
            </h2>
            <p className="text-coffee-medium/80 text-lg leading-relaxed mb-6">
              Kopi Hening adalah ruang tenang di tengah hiruk pikuk. Kami percaya kopi bukan hanya rasa, tapi pengalaman. Tempat tenang untuk menikmati kopi, bekerja, dan menenangkan pikiran.
            </p>
            <p className="text-coffee-medium/70 leading-relaxed mb-8">
              Setiap cangkir kopi yang kami sajikan adalah hasil dari perjalanan panjang biji kopi pilihan dari petani lokal, disangrai dengan teknik yang sempurna, dan diseduh dengan penuh perhatian. Kami berkomitmen untuk menciptakan momen hening yang berharga bagi setiap pengunjung.
            </p>
            <div className="flex gap-8">
              <div>
                <span className="block text-3xl font-serif font-bold text-coffee-dark">5+</span>
                <span className="text-sm text-coffee-medium/70">Tahun Berdiri</span>
              </div>
              <div>
                <span className="block text-3xl font-serif font-bold text-coffee-dark">10K+</span>
                <span className="text-sm text-coffee-medium/70">Pelanggan Puas</span>
              </div>
              <div>
                <span className="block text-3xl font-serif font-bold text-coffee-dark">15+</span>
                <span className="text-sm text-coffee-medium/70">Varian Kopi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Menu Section
function MenuSection() {
  const { ref, isVisible } = useScrollReveal();

  const products = [
    {
      name: 'Kopi Susu Hening',
      description: 'Perpaduan kopi robusta dan susu segar dengan rasa lembut.',
      price: 'Rp 25.000',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
      tag: 'Best Seller'
    },
    {
      name: 'Espresso Tenang',
      description: 'Espresso pekat untuk momen reflektif dan fokus.',
      price: 'Rp 18.000',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80',
      tag: 'Klasik'
    },
    {
      name: 'Kopi Tubruk Senja',
      description: 'Kopi tubruk klasik dengan aroma nusantara.',
      price: 'Rp 20.000',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      tag: 'Tradisional'
    }
  ];

  return (
    <section id="menu" className="py-24 bg-coffee-dark">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-coffee-light text-sm font-medium tracking-widest uppercase mb-4 block">
            Menu Unggulan
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4">
            Menu Unggulan
          </h2>
          <p className="text-cream/60 max-w-xl mx-auto">
            Racikan kopi pilihan untuk menemani momen tenangmu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.name}
              className={`group bg-coffee-darker/50 rounded-2xl overflow-hidden transition-all duration-700 hover:transform hover:scale-105 hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-cream text-coffee-dark text-xs font-medium rounded-full">
                    {product.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-xl font-semibold text-cream">
                    {product.name}
                  </h3>
                  <span className="text-coffee-light font-semibold">{product.price}</span>
                </div>
                <p className="text-cream/60 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>
                <a 
                  href={`https://wa.me/6281234567890?text=Halo, saya ingin pesan ${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-cream/10 hover:bg-cream hover:text-coffee-dark text-cream rounded-lg transition-all duration-300 text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Trust Section
function TrustSection() {
  const { ref, isVisible } = useScrollReveal();

  const features = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: 'Biji Kopi Pilihan',
      description: 'Disangrai dengan standar rasa yang konsisten dan seimbang.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Suasana Tenang',
      description: 'Ruang yang dirancang untuk berpikir, bekerja, dan menenangkan diri.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Disajikan dengan Hati',
      description: 'Setiap cangkir dibuat dengan perhatian pada detail.'
    }
  ];

  return (
    <section className="py-24 bg-cream">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-coffee-medium text-sm font-medium tracking-widest uppercase mb-4 block">
            Keunggulan Kami
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-dark">
            Kenapa Kopi Hening?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-700 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-light/20 text-coffee-dark mb-6">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-coffee-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-coffee-medium/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery Section
function GallerySection() {
  const { ref, isVisible } = useScrollReveal();

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      alt: 'Suasana Kopi Hening'
    },
    {
      src: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
      alt: 'Interior Kopi Hening'
    },
    {
      src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      alt: 'Sudut Tenang Kopi Hening'
    }
  ];

  return (
    <section id="galeri" className="py-24 bg-coffee-light/10">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-coffee-medium text-sm font-medium tracking-widest uppercase mb-4 block">
            Galeri
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
            Suasana Kopi Hening
          </h2>
          <p className="text-coffee-medium/70 max-w-xl mx-auto">
            Ruang sederhana untuk menikmati kopi dan keheningan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={image.alt}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-cream font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Location Section
function LocationSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="lokasi" className="py-24 bg-cream">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-coffee-medium text-sm font-medium tracking-widest uppercase mb-4 block">
            Lokasi
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
            Lokasi Kami
          </h2>
          <p className="text-coffee-medium/70 max-w-xl mx-auto">
            Datang dan rasakan langsung ketenangan Kopi Hening.
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-xl h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613507864!3d-6.194741395493371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sMonas!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <MapPin className="w-6 h-6 text-coffee-dark mb-3" />
              <h3 className="font-semibold text-coffee-dark mb-2">Alamat</h3>
              <p className="text-coffee-medium/70 text-sm leading-relaxed">
                Jl. Hening No. 123, Jakarta Pusat, Indonesia
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <Clock className="w-6 h-6 text-coffee-dark mb-3" />
              <h3 className="font-semibold text-coffee-dark mb-2">Jam Buka</h3>
              <p className="text-coffee-medium/70 text-sm">
                Senin - Jumat: 07:00 - 22:00<br />
                Sabtu - Minggu: 08:00 - 23:00
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <Phone className="w-6 h-6 text-coffee-dark mb-3" />
              <h3 className="font-semibold text-coffee-dark mb-2">Telepon</h3>
              <p className="text-coffee-medium/70 text-sm">
                +62 812 3456 7890
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <section id="kontak" className="py-24 bg-coffee-dark">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-coffee-light text-sm font-medium tracking-widest uppercase mb-4 block">
            Kontak
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-4">
            Hubungi Kami
          </h2>
          <p className="text-cream/60 max-w-xl mx-auto">
            Punya pertanyaan atau ingin bekerja sama?
          </p>
        </div>

        <div className={`max-w-xl mx-auto transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Nama"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-6 py-4 bg-cream/10 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50 focus:bg-cream/15 transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-6 py-4 bg-cream/10 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50 focus:bg-cream/15 transition-all"
              />
            </div>
            <div>
              <textarea
                rows={4}
                placeholder="Pesan"
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-6 py-4 bg-cream/10 border border-cream/20 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-cream/50 focus:bg-cream/15 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-cream text-coffee-dark rounded-xl font-medium hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Mengirim...</span>
              ) : isSubmitted ? (
                <span>Pesan Terkirim!</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 bg-coffee-light/20">
      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-coffee-dark mb-6">
            Siap Menikmati Hening?
          </h2>
          <p className="text-coffee-medium/70 text-lg mb-10 max-w-xl mx-auto">
            Pesan sekarang atau tanyakan menu favoritmu langsung via WhatsApp.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-coffee-dark text-cream rounded-full font-medium hover:bg-coffee-darker transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 bg-coffee-darker">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-cream" />
            <span className="font-serif text-xl font-semibold text-cream">
              Kopi Hening
            </span>
          </div>
          <p className="text-cream/50 text-sm text-center">
            © 2026 Kopi Hening · By Nrhamadani
          </p>
          <div className="flex gap-4">
            <a 
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-cream hover:text-coffee-dark transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a 
              href="mailto:hello@kopihening.id"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-cream hover:text-coffee-dark transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Floating WhatsApp Button
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/6281234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
      <span className="absolute right-full mr-3 px-3 py-1 bg-coffee-dark text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat Kami
      </span>
    </a>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TrustSection />
      <GallerySection />
      <LocationSection />
      <ContactSection />
      <FinalCTASection />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
