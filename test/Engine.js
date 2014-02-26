var solfege = require('solfegejs');
var co = require('co');
var expect = require('chai').expect;
var should = require('chai').should();

/**
 * Test the Engine class
 */
describe('Engine', function()
{
    var Engine = require('../bundle/Engine');
    var engine;

    /**
     * Initialize the test suite
     */
    before(co(function*()
    {
        engine = new Engine();
    }));


    /**
     * Test the renderFile() function
     */
    describe('#renderFile()', co(function*()
    {
        // Simple SCSS file without SASS feature
        it('should render a simple SCSS file without SASS feature', co(function*()
        {
            var css = yield engine.renderFile(__dirname + '/files/simple.scss');
            expect(css).to.equal('body {color:white;background:blue;}');
        }));

        // Import variables
        it('should handle import', co(function*()
        {
            var css = yield engine.renderFile(__dirname + '/files/import.scss');
            expect(css).to.equal('body {color:red;}');
        }));


    }));
});
