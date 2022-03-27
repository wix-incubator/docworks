const runJsDoc = require('docworks-jsdoc2spec')
const { merge } = require('docworks-repo')
const { UNIVERSAL_SCOPES, FRONTEND_SCOPE } = require('../src')

const WIX_SCOPES_PLUGIN_PATH = ['src/index']

const services = {
    FRONTEND_SERVICE: {
        'include': [
          'test/frontendService.js'
        ],
    },
    BACKEND_SERVICE: {
        'include': [
          'test/backendService.js'
        ],
    }
}

describe('wix-scopes - integration test', () => {
    it('should extract valid scopes from the jsDoc service', () => {
        const jsDocRes = runJsDoc(services.FRONTEND_SERVICE, WIX_SCOPES_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')
    
        expect(jsDocService).toEqual(
            expect.objectContaining({
                extra: {
                    scopes: [FRONTEND_SCOPE]
                }
            })
        )
    })

    it('should merge scopes correctly', () => {
        const frontendJsDocRes = runJsDoc(services.FRONTEND_SERVICE, WIX_SCOPES_PLUGIN_PATH)
        const backendJsDocRes = runJsDoc(services.BACKEND_SERVICE, WIX_SCOPES_PLUGIN_PATH)
        const mergeResult = merge(backendJsDocRes.services, frontendJsDocRes.services, ['src/index'])
        const jsDocService = mergeResult.repo.find(s => s.name === 'Service')
    
        expect(jsDocService).toEqual(
            expect.objectContaining({
                extra: {
                    scopes: UNIVERSAL_SCOPES
                }
            })
        )
    })
})