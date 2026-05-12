import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'License Agreement',
  description: 'Pipiklo License Agreement — governs use of all digital assets on Pipiklo.',
}

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            ⚖️ Legal Document
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Pipiklo License Agreement</h1>
          <p className="text-muted-foreground">Last Revised: May 12, 2026</p>
        </div>

        <div className="space-y-8">
          <section className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-6 border border-brand-200 dark:border-brand-800">
            <h2 className="text-xl font-bold mb-3">About Pipiklo and This License</h2>
            <p className="text-muted-foreground">Welcome to Pipiklo. This License Agreement ("License") governs the use of all digital assets, AI-generated content, templates, tools, stock resources, fonts, graphics, videos, audio files, 3D assets, website templates, and other downloadable or generated materials ("Items") available through Pipiklo.</p>
            <p className="text-muted-foreground mt-3">This License forms a legally binding agreement between Pipiklo and the user ("Subscriber", "User", "You"). By downloading, generating, accessing, or using any Item from Pipiklo, you agree to comply with this License.</p>
            <p className="text-muted-foreground mt-3">If there is any conflict between this License and Pipiklo's Terms of Service, this License will prevail regarding Item usage rights.</p>
          </section>

          {[
            {
              num: '1', title: 'Commercial License',
              content: `Pipiklo provides a simple commercial license for all Items available on the platform.

You receive:
• Non-exclusive commercial usage rights
• Worldwide usage rights
• Rights to modify and customize Items
• Rights to use Items in personal and client projects
• Ongoing usage rights for completed projects created during an active subscription

All Items remain the intellectual property of their respective creators and/or Pipiklo.`
            },
            {
              num: '2', title: 'One Project Per License',
              content: `Every time you download or generate an Item, a separate license is created for one specific end use or project.

If you want to use the same Item in multiple different projects, campaigns, products, or brands, you must create a new license for each separate use.

Example:
• Using one video template for one YouTube channel intro = allowed
• Using the same template for another client or another brand = requires a new license`
            },
            {
              num: '3', title: 'Ownership Rights',
              content: `All Items available on Pipiklo are owned by Pipiklo or the original creators.

You MAY:
• Modify Items
• Customize Items
• Combine Items into larger creative works
• Use Items commercially within allowed terms

You MAY NOT:
• Claim ownership of the original Item
• Register trademarks directly on Items
• Resell Items as standalone assets
• Redistribute source files`
            },
            {
              num: '4', title: 'Permitted Usage',
              content: `You may use Pipiklo Items to create:

• Social media content
• YouTube videos
• Advertisements & marketing campaigns
• Websites and landing pages
• Mobile applications
• Branding projects
• Client work
• Educational projects
• Business presentations
• Product packaging
• Online courses
• Broadcast graphics
• AI-enhanced creative projects

You may create unlimited copies of the final End Product.`
            },
            {
              num: '5', title: 'AI Generated Content',
              content: `Pipiklo includes AI-powered generation tools such as ImageGen, ImageEdit, VideoGen, MusicGen, VoiceGen, SoundGen, GraphicsGen, and MockupGen.

• Generated outputs may be used commercially unless otherwise stated
• Users are responsible for reviewing generated outputs before publishing or distributing them
• Pipiklo does not guarantee exclusivity of AI-generated outputs`
            },
            {
              num: '6', title: 'Client Work',
              content: `You may create End Products for clients.

When transferring a completed End Product to a client:
• The client receives rights only for the final End Product
• The client may not extract or reuse original Items separately
• The client may not redistribute source assets
• Separate projects require separate licenses`
            },
            {
              num: '7', title: 'Modifications and Customization',
              content: `You may edit Items, change colors, layouts, and typography, add branding, combine multiple Items, and adapt content for different platforms.

Modified Items remain subject to this License.`
            },
            {
              num: '8', title: 'Restrictions',
              content: `8.1 Resell or Redistribute — You cannot resell Items as standalone assets, share source files publicly, upload Items to other marketplaces, or package Items into competing services.

8.2 On-Demand Services — You cannot use Items in print-on-demand systems, AI asset generators, template builders, or user-customizable applications unless substantial original customization has been applied.

8.3 Merchandise Restrictions — You may not use Items where the primary value comes from the original Item itself (e.g., selling unmodified graphics on T-shirts).

8.4 Trademark Restrictions — You may not trademark original graphics, logos, fonts, icons, templates, or AI-generated assets directly from Pipiklo unless substantially transformed.`
            },
            {
              num: '9', title: 'Subscription Requirements',
              content: `An active Pipiklo subscription is required to download Items, generate AI content, access premium assets, and create new licensed projects.

If your subscription ends:
• Previously completed projects remain licensed
• Unfinished projects lose usage rights
• New downloads and generations are disabled`
            },
            {
              num: '10', title: 'Fonts and Add-ons',
              content: `Fonts and add-ons may only be installed and used during an active subscription.

You MAY use fonts in completed commercial projects, create branding and visual assets, and use add-ons within supported software.

You MAY NOT redistribute font files, share installation files, or allow third parties direct access to font assets.

Completed End Products created during an active subscription remain permanently licensed.`
            },
            {
              num: '11', title: 'Music and Audio Terms',
              content: `Music and audio Items may be used in YouTube videos, podcasts, social media content, online advertisements, educational videos, and promotional content.

Restrictions may apply for television broadcasting, radio broadcasting, large theatrical distribution, and music streaming redistribution.

Users are responsible for obtaining any additional public performance licenses if legally required.`
            },
            {
              num: '15', title: 'Acceptable Use',
              content: `You may not use Pipiklo Items for illegal activities, hate speech, defamation, pornographic or explicit content, misleading identity creation, deepfake impersonation, fraudulent activities, or harmful or discriminatory content.

Pipiklo reserves the right to terminate accounts violating these terms.`
            },
            {
              num: '16', title: 'Termination',
              content: `Pipiklo may suspend or terminate access if this License is violated, platform abuse occurs, fraudulent activity is detected, or unauthorized redistribution is identified.

Upon termination:
• Rights to unfinished projects end immediately
• Users must stop distributing unauthorized content
• Access to premium Items may be revoked`
            },
            {
              num: '17', title: 'Changes to This License',
              content: `Pipiklo may update this License at any time. Updated versions will be published on the official Pipiklo website. Continued use of the platform means acceptance of revised terms.`
            },
            {
              num: '19', title: 'Contact Information',
              content: `For licensing support or legal inquiries:

Email: legal@pipiklo.com
Website: www.pipiklo.com`
            },
          ].map((section) => (
            <section key={section.num} className="border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-3">
                <span className="text-brand-500 mr-2">{section.num}.</span>
                {section.title}
              </h2>
              <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}

          {/* Definitions */}
          <section className="border rounded-2xl p-6 bg-muted/30">
            <h2 className="text-lg font-bold mb-4">20. Definitions</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { term: 'Item', def: 'Any downloadable, generated, or accessible digital asset available on Pipiklo.' },
                { term: 'End Product', def: 'A completed project or final work created using one or more Pipiklo Items.' },
                { term: 'Subscriber', def: 'An individual or organization with access to Pipiklo services.' },
                { term: 'Tools', def: 'Software extensions, templates, plugins, add-ons, AI systems, and creative utilities available through Pipiklo.' },
              ].map((d) => (
                <div key={d.term} className="p-3 rounded-xl bg-background border">
                  <p className="font-semibold text-brand-600 mb-1">{d.term}</p>
                  <p className="text-muted-foreground text-xs">{d.def}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center py-6 text-sm text-muted-foreground">
            © 2026 Pipiklo. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
