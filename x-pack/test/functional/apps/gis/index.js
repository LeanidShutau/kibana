/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export default function ({ loadTestFile, getService }) {
  const kibanaServer = getService('kibanaServer');
  const esArchiver = getService('esArchiver');
  const browser = getService('browser');

  describe('gis app', function () {
    this.tags('ciGroup3');

    before(async () => {
      await esArchiver.loadIfNeeded('logstash_functional');
      await esArchiver.load('gis/data');
      await esArchiver.load('gis/kibana');
      await kibanaServer.uiSettings.replace({
        'dateFormat:tz': 'UTC',
        'defaultIndex': 'logstash-*'
      });
      await kibanaServer.uiSettings.disableToastAutohide();
      browser.setWindowSize(1600, 1000);

    });

    after(async () => {
      await esArchiver.unload('gis/data');
      await esArchiver.unload('gis/kibana');
    });

    loadTestFile(require.resolve('./sample_data'));
    loadTestFile(require.resolve('./load_saved_object'));
    loadTestFile(require.resolve('./es_search_source'));
    loadTestFile(require.resolve('./es_geohashgrid_source'));
    loadTestFile(require.resolve('./joins'));
  });
}
