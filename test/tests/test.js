'use strict';

const assert = require('assert');
const I18n = require('../../lib/i18n');

it( 'Should localize without transformations', () =>
{
	const localization = new I18n({ dictionaries: [ '../locale/localization.json', '../locale/localization.js' ] });

	assert.equal( localization.get( 'en', 'foo.bar'), 'foo.bar.en' );
	assert.equal( localization.get( 'de', 'foo.bar'), 'foo.bar.de' );
	assert.equal( localization.get( 'es', 'foo.bar'), 'foo.bar' );
	assert.equal( localization.get( 'en', 'foo.bar.goo'), 'foo.bar.goo' );
	assert.equal( localization.get( 'en', 'foo.bars'), 'foo.bar.en2' );
	assert.equal( localization.get( 'en', 'foo.bars', { user: { name: 'John' }}), 'foo.bar.en1 John' );
	assert.equal( localization.get( 'en', 'foo.user', { username: 'John' }), 'foo.user.en user.name' );
	assert.equal( localization.get( 'en', 'bar.foo'), 'bar.foo.en' );
	assert.equal( localization.get( 'en', 'foobar'), 'foobar' );
	assert.equal( localization.get( 'en', 'foobar', 'bar.foo'), 'bar.foo.en' );
	assert.equal( localization.get( 'en', 'foobar', 'barfoo'), 'foobar' );
});

it( 'Should localize with transformations', () =>
{
	const localization = new I18n({ locale:'en', dictionary: __dirname + '/../locale/localization.json', transformation: s => s.toUpperCase(), variableTransformation: v => '"' + v + '"' });

	assert.equal( localization.get( 'en', 'foo.bar'), 'FOO.BAR.EN' );
	assert.equal( localization.get( 'de', 'foo.bar'), 'FOO.BAR.DE' );
	assert.equal( localization.get( 'es', 'foo.bar'), 'FOO.BAR.EN' );
	assert.equal( localization.get( 'en', 'foo.bar.goo'), 'foo.bar.goo' );
	assert.equal( localization.get( 'en', 'foo.bars'), 'FOO.BAR.EN2' );
	assert.equal( localization.get( 'en', 'foo.bars', { user: { name: 'John' }}), 'FOO.BAR.EN1 "JOHN"' );
	assert.equal( localization.get( 'en', 'foo.user', { username: 'John' }), 'FOO.USER.EN USER.NAME' );
	assert.equal( localization.get( 'en', 'foo.user', { username: 'John' }, { user: { name: 'Doe' }}), 'FOO.USER.EN "DOE"' );
	assert.equal( localization.get( 'en', 'foobar'), 'foobar' );
	assert.equal( localization.get( 'en', 'foobar', 'foo.bar'), 'FOO.BAR.EN' );
	assert.equal( localization.get( 'en', 'foobar', 'barfoo'), 'foobar' );
});

it( 'Should create dictionary', () =>
{
	const localization = new I18n({ locale:'en', dictionary: __dirname + '/../locale/localization.json' });

	assert.deepStrictEqual( localization.dictionary( 'en' ), 
	{
		foo: 
		{
			bar: 'foo.bar.en',
			bars: 'foo.bar.en2',
			user: 'foo.user.en {user.name%s}'
		}
	});

	assert.deepStrictEqual( localization.dictionary( 'de', 'foo' ), 
	{
		bar: 'foo.bar.de',
		bars: 'foo.bar.de2',
		user: 'foo.user.de {user.name%s}'
	});

	assert.deepStrictEqual( localization.dictionary( 'de', 'foo.bar.foo' ), {});
});
