var solfege = require('solfegejs');
var sass = require('node-sass');

/**
 * The sass engine
 */
var Engine = solfege.util.Class.create(function()
{
    // Set the default configuration
    this.configuration = require('../configuration/default.js');

    // Bind public methods to this instance
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.assetFilter = bindGenerator(this, this.assetFilter);

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
 * @api     public
 */
proto.renderFile = function*(filePath, options)
{
    var self = this;

    // Use the configuration file is the options is not provided
    options = options || this.configuration;

    var result = yield function(done)
    {
        sass.render({
            file: filePath,
            success: function(generatedCss) {
                done(null, generatedCss);
            },
            error: function(error) {
                done(error);
            },
            outputStyle: options.outputStyle,
            sourceComments: options.sourceComments,
            sourceMap: options.sourceMap,
            includePaths: options.includePaths
        });
    };

    return result;
};

/**
 * Render a content
 *
 * @param   {String}    scss        The content
 * @param   {Object}    options     The options
 * @return  {String}                The generated CSS
 * @api     public
 */
proto.renderContent = function*(scss, options)
{
    var self = this;

    // Use the configuration file is the options is not provided
    options = options || this.configuration;

    var result = yield function(done)
    {
        sass.render({
            data: scss,
            success: function(generatedCss) {
                done(null, generatedCss);
            },
            error: function(error) {
                done(error);
            },
            outputStyle: options.outputStyle,
            sourceComments: options.sourceComments,
            sourceMap: options.sourceMap,
            includePaths: options.includePaths
        });
    };

    return result;
};

/**
 * The filter for the assets bundle
 *
 * @param   {Array}     files       The file list of a package
 * @param   {Array}     contents    The content list of a package
 * @return  {Array}                 The new content list
 * @api     public
 */
proto.assetFilter = function*(files, contents)
{
    var modulePath = require('path');
    var newContents = [];
    var total = contents.length;

    // Render each content
    for (var index = 0; index < total; ++index) {
        // Set the include path
        var includePath = modulePath.dirname(files[index]);
        var options = this.cloneConfiguration();
        options.includePaths.unshift(includePath);

        // Render
        var content = contents[index];
        var newContent = yield this.renderContent(content, options);
        newContents.push(newContent);
    }

    return newContents;
};

/**
 * Clone the configuration
 *
 * @return  {Object}        The cloned configuration
 * @api     private
 */
proto.cloneConfiguration = function()
{
    var clone = {};
    for (var property in this.configuration) {
        var value = this.configuration[property];

        if (value instanceof Array) {
            clone[property] = value.concat();
            continue;
        }

        clone[property] = value;
    }

    return clone;
};

module.exports = Engine;
