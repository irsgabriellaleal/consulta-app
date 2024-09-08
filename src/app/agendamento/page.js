import Link from "next/link";

export default function Agendamento() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-black">Clinix</span>
        </div>
        <Link href="/agendamento/scheduler" className="flex items-center justify-center" prefetch={false}>
          <span className="sr-only ">Appointment Scheduler</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/agendamento/home" className="text-sm font-medium hover:underline underline-offset-4 text-neutral-900" prefetch={false}>
            Home
          </Link>
          <Link href="/agendamento/sobre-nos" className="text-sm font-medium hover:underline underline-offset-4 text-neutral-900" prefetch={false}>
            Sobre Nós
          </Link>
          <Link href="/agendamento/profissionais" className="text-sm font-medium hover:underline underline-offset-4 text-neutral-900" prefetch={false}>
            Profissionais
          </Link>
          <Link href="/agendamento/agendar-consulta" className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}>
            Agendar Consulta
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-neutral-900">
                    Agende Suas Consultas de Forma Fácil e Rápida 
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl text-neutral-900">
                    Simplifique sua vida com nosso sistema de Agendamento. A qualquer hora, em qualquer lugar. Simples, seguro e feito para você.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-800 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Agendar Agora
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer a wide range of healthcare services to meet your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <HeartPulseIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Primary Care</h3>
                  <p className="text-muted-foreground">
                    Schedule an appointment with our experienced primary care providers.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <StethoscopeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Specialty Care</h3>
                  <p className="text-muted-foreground">Access our network of specialists for advanced medical care.</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <MicroscopeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Diagnostic Tests</h3>
                  <p className="text-muted-foreground">Schedule lab tests and imaging appointments with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Patients Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from our satisfied patients about their experience with our healthcare services.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <p className="text-muted-foreground">
                    "The staff was incredibly friendly and helpful. I had a\n great experience with my appointment."
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Jane Smith</h3>
                  <p className="text-muted-foreground">
                    "I was able to easily schedule my appointment online and\n the process was seamless."
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Michael Johnson</h3>
                  <p className="text-muted-foreground">
                    "The healthcare providers were knowledgeable and took the\n time to address all of my concerns."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Appointment Scheduler. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function HeartPulseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  )
}


function MicroscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  )
}


function StethoscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  )
}