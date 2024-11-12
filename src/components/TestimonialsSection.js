'use client';

const testimonials = [
  {
    name: "João Silva",
    role: "Paciente desde 2022",
    image: "https://i.pravatar.cc/150?img=1", // Placeholder
    content: "A equipe foi incrivelmente amigável e prestativa. Tive uma ótima experiência com minha consulta e recomendo a todos.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "Paciente desde 2021",
    image: "https://i.pravatar.cc/150?img=2", // Placeholder
    content: "Consegui agendar minha consulta online facilmente e o processo foi muito simples. Os médicos são muito atenciosos!",
    rating: 5
  },
  {
    name: "Carlos Oliveira",
    role: "Paciente desde 2023",
    image: "https://i.pravatar.cc/150?img=3", // Placeholder
    content: "Os profissionais de saúde foram muito competentes e dedicaram tempo para abordar todas as minhas preocupações.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            O Que Nossos Pacientes Dizem
          </h2>
          <p className="text-lg text-gray-600">
            Feedback real de pacientes que confiaram em nossos serviços para cuidar da sua saúde.
          </p>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.name}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl 
                transition-all duration-300 hover:-translate-y-1"
            >
              {/* Aspas decorativas */}
              <div className="absolute top-4 right-4 text-6xl text-blue-500/20 font-serif">"</div>

              {/* Conteúdo */}
              <div className="relative">
                {/* Avatar e Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-50">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Depoimento */}
                <p className="text-gray-600 italic">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}