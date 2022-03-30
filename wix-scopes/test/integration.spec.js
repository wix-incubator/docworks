const runJsDoc = require('docworks-jsdoc2spec')
const { merge } = require('docworks-repo')
const { UNIVERSAL_SCOPES, FRONTEND_SCOPE, BACKEND_SCOPE } = require('../src')

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
    },
    UNIVERSAL_SERVICE: {
        'include': [
          'test/universalService.js'
        ],
    }
}

describe('wix-scopes - integration test', () => {
    it('should extract valid frontend scope from the jsDoc service', () => {
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

    it('should extract valid backend scope from the jsDoc service', () => {
        const jsDocRes = runJsDoc(services.BACKEND_SERVICE, WIX_SCOPES_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')
    
        expect(jsDocService).toEqual(
            expect.objectContaining({
                extra: {
                    scopes: [BACKEND_SCOPE]
                }
            })
        )
    })

    it('should extract valid frontend and backend scopes from the jsDoc service', () => {
        const jsDocRes = runJsDoc(services.UNIVERSAL_SERVICE, WIX_SCOPES_PLUGIN_PATH)
        const jsDocService = jsDocRes.services.find(s => s.name === 'Service')
    
        expect(jsDocService).toEqual(
            expect.objectContaining({
                extra: {
                    scopes: UNIVERSAL_SCOPES
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