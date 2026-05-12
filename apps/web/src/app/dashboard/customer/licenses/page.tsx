'use client'

import { MOCK_LICENSES } from '@/lib/mock-data'
import { Download, Shield, ExternalLink } from 'lucide-react'

export default function CustomerLicensesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Licenses</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          All Pipiklo licenses issued to your account. Each download generates a unique license certificate.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_LICENSES.map((license) => (
          <div
            key={license.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {license.item?.thumbnailUrl && (
                  <img
                    src={license.item.thumbnailUrl}
                    alt={license.item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {license.item?.title ?? 'Unknown Item'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3 h-3 text-brand-500" />
                    <span className="text-xs font-mono text-brand-600 dark:text-brand-400">{license.licenseKey}</span>
                  </div>
                  {license.projectName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Project: {license.projectName}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Issued {new Date(license.issuedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full text-center">
                  Valid
                </span>
                <a
                  href={license.certificateUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Certificate
                </a>
                <a
                  href={`/license?key=${license.licenseKey}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Verify
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {MOCK_LICENSES.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No licenses yet. Download assets to generate licenses.</p>
        </div>
      )}
    </div>
  )
}
