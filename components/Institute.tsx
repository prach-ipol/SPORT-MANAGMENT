import Image from "next/image"
import Link from "next/link"

export function AboutInstitute() {
  return (
    <section className="container py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-10">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-black">
          About Our Institute
        </h2>
        <p className="max-w-[85%] leading-normal text-black sm:text-lg sm:leading-7">
          Learn more about Yashavantrao Chavan Institute of Science
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative h-[300px] lg:h-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-lPtU1ZGt5W0cVj2vzbpM82Ji5ISFn8.jpeg"
              alt="Yashavantrao Chavan Institute of Science Building"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 lg:p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-4 text-black">
              Yashavantrao Chavan Institute of Science
            </h3>
            <div className="space-y-4 text-black flex-1">
              <p>
                Yashavantrao Chavan Institute of Science (YCIS), Satara, established in 1958, is a government-aided
                science college affiliated with Karmaveer Bhaurao Patil University, Satara.
              </p>
              <p>
                The institute offers undergraduate and postgraduate programs in various science disciplines, including
                B.Sc. and M.Sc. degrees in fields like Physics, Chemistry, Botany, Zoology, Microbiology, and Computer
                Science. Professional courses such as BCS (Bachelor of Computer Science), B.Voc in Software Development,
                and B.Lib & I.Sc. are also available.
              </p>
              <p>
                YCIS has been accredited with an 'A' grade by the National Assessment and Accreditation Council (NAAC)
                and recognized as a 'College with Potential for Excellence' by the University Grants Commission (UGC).
              </p>
              <p>
                The campus is equipped with facilities like a library, laboratories, hostel accommodations, canteen, and
                ICT-enabled classrooms.
              </p>
            </div>
            <div className="mt-6">
              <Link 
                href="https://ycis.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-50 transition-colors"
              >
                Visit Official Website
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}