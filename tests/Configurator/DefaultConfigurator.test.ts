import {
	defaultConfiguration,
	DefaultConfigurator,
} from '../../src/Configurator/DefaultConfigurator'
import { describe, expect, it } from '@jest/globals'

describe('DefaultConfigurator', () => {
	it('gets default options', async () => {
		const defaultConfigurator = new DefaultConfigurator()
		const options = await defaultConfigurator.getOptions()

		expect(options).toStrictEqual(defaultConfiguration)
	})
})
