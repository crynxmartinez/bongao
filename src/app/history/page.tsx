import Image from 'next/image'
import { PublicHeader } from '@/components/layout/public-header'
import { Card, CardContent } from '@/components/ui/card'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">History of Tawi-Tawi</h1>
          <p className="text-white/80">
            Discover the rich heritage and history of the Province of Tawi-Tawi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Etymology Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Etymology</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  The name &quot;Tawi-Tawi&quot; is derived from the word &quot;tawi&quot; which means &quot;far&quot; or &quot;distant&quot; in the local Sama language. The repetition of the word emphasizes the remoteness of the islands, as Tawi-Tawi is the southernmost province of the Philippines, located at the very edge of the country&apos;s territorial boundaries.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Pre-Colonial History */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Pre-Colonial Era</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Long before the arrival of foreign colonizers, Tawi-Tawi was already a thriving center of trade and commerce in Southeast Asia. The islands were inhabited by the Sama people, skilled seafarers and traders who established extensive maritime networks connecting the Philippines to Borneo, Indonesia, and other parts of the Malay Archipelago.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The Sultanate of Sulu, which included Tawi-Tawi in its domain, was one of the most powerful Islamic kingdoms in the region. Islam was introduced to the islands as early as the 14th century, making Tawi-Tawi one of the earliest places in the Philippines to embrace the Islamic faith.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Colonial Period */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Colonial Period</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  During the Spanish colonial period, Tawi-Tawi remained largely independent, as the Spanish forces were unable to fully subjugate the Muslim populations of Mindanao and Sulu. The islands served as a bastion of resistance against colonial rule.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Under American rule, Tawi-Tawi was incorporated into the Moro Province and later became part of the Department of Mindanao and Sulu. The Americans established civil government in the area, though traditional leadership structures continued to play an important role in local governance.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Creation as Province */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Creation as a Province</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Tawi-Tawi was officially created as a separate province on September 11, 1973, through Presidential Decree No. 302 signed by President Ferdinand E. Marcos. Prior to this, the islands were part of the province of Sulu.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The creation of Tawi-Tawi as a distinct province recognized the unique identity and needs of its people, and paved the way for more focused development efforts in the region.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Modern Era */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Modern Era</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Today, Tawi-Tawi is part of the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM). The province continues to develop while preserving its rich cultural heritage and traditions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Tawi-Tawi is known for its pristine beaches, rich marine biodiversity, and vibrant Sama culture. The province is home to the famous Bud Bongao, a sacred mountain that serves as a pilgrimage site, and the historic Sheik Karim ul-Makhdum Mosque in Simunul, considered the oldest mosque in the Philippines.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Under the leadership of Governor Yshmael &quot;Mang&quot; I. Sali, the province is pursuing an ambitious 11-Point Agenda aimed at transforming Tawi-Tawi into a gateway for trade and tourism in the BIMP-EAGA region, while ensuring sustainable development and improved quality of life for all Tawi-Tawians.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Historical Facts */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Key Historical Facts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Province Creation</h3>
                  <p className="text-muted-foreground">September 11, 1973</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Capital</h3>
                  <p className="text-muted-foreground">Bongao</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Number of Municipalities</h3>
                  <p className="text-muted-foreground">11 Municipalities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Region</h3>
                  <p className="text-muted-foreground">BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Oldest Mosque</h3>
                  <p className="text-muted-foreground">Sheik Karim ul-Makhdum Mosque (Simunul)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Sacred Mountain</h3>
                  <p className="text-muted-foreground">Bud Bongao</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi
          </p>
        </div>
      </footer>
    </div>
  )
}

export const metadata = {
  title: 'History - Province of Tawi-Tawi',
  description: 'Learn about the rich history and heritage of the Province of Tawi-Tawi, from pre-colonial times to the modern era.',
}
