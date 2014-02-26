var solfege = require('solfegejs');
var sass = require('node-sass');

/**
 * The sass engine
 */
var Engine = solfege.util.Class.create(function()
{
    // Set the default configuration
    this.configuration = require('../configuration/default.js');

}, 'solfege.bundle.sass.Engine');
var proto = Engine.prototype;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 * @api     public
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = solfege.util.Object.merge(this.configuration, customConfiguration);
};


/**
 * Render
 *
 * @param   {String}    filePath    The file path
 * @param   {Object}    options     The options
 * @return  {String}                The generated CSS
 */
proto.renderFile = function*(filePath, options)
{
    var self = this;

    // Use the configuration file is the options is not provided
    options = options || this.configuration;

    var css = yield function(done)
    {
        sass.render({
            file: filePath,
            success: function(generatedCss) {
                done(null, generatedCss);
            },
            error: function(error) {
                done(error);
            },
            outputStyle: options.outputStyle
        });
    };

    return css;
};

module.exports = Engine;
