interface BlogHeroProps {
  latestPost?: any;
}

const BlogHero = ({ latestPost }: BlogHeroProps) => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 pt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'white' }}>
            Blog AtendeSoft
          </h1>
          <p className="text-xl md:text-2xl mb-8" style={{ color: 'white' }}>
            Descubra as últimas tendências em automação comercial, inteligência artificial e transformação digital
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;