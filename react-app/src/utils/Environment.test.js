import _ from 'lodash'
import Environment from './Environment'

const expect = require('chai').expect

describe('Environment', function() {

  afterEach(function() {
    Environment.uninitializeConfigurationVariables()
  })

  it('succeeds when all environment variables are defined', function() {
    // set REACT_APP_DEBUG to false to avoid Environment's logging
    // eslint-disable-next-line no-undef
    Environment.initializeConfigurationVariables(_.extend({}, process.env, {
      REACT_APP_DEBUG: 'false',
    }))
  })

  // it('fails when too few variables are defined', function() {
  //   const configuration = {}
  //   expect(function() {
  //     Environment.initializeConfigurationVariables(configuration)
  //   }).to.throw()
  // })

  it('fails when too many variables are defined', function() {
    const configuration = {}
    _.keys(Environment.getConfigurationVars()).forEach(function(key) {
      configuration['REACT_APP_' + key] = ''
    })

    configuration.REACT_APP_FAKEY_MCFAKERSON = 'bad value'

    expect(function() {
      Environment.initializeConfigurationVariables(configuration)
      // eslint-disable-next-line jest/valid-expect
    }).to.throw('Extra values')
  })

})
