const Footer = () => {
  return (
    <footer className="border-t border-dark-800 bg-dark-950/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-display font-semibold text-sm gradient-text">
              TravelMind AI
            </span>
          </div>
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} TravelMind AI. Powered by Google Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
