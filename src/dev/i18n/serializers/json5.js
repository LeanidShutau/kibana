/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import JSON5 from 'json5';
import { i18n } from '@kbn/i18n';

const ESCAPE_SINGLE_QUOTE_REGEX = /\\([\s\S])|(')/g;

export function serializeToJson5(messages, formats = i18n.formats) {
  // .slice(0, -1): remove closing curly brace from json to append messages
  let jsonBuffer = Buffer.from(JSON5.stringify({ formats }, { quote: `'`, space: 2 }).slice(0, -1));

  for (const [mapKey, mapValue] of Array.isArray(messages) ? messages : Object.entries(messages)) {
    const formattedMessage = mapValue.message.replace(ESCAPE_SINGLE_QUOTE_REGEX, '\\$1$2');
    const formattedContext = mapValue.context
      ? mapValue.context.replace(ESCAPE_SINGLE_QUOTE_REGEX, '\\$1$2')
      : '';

    jsonBuffer = Buffer.concat([
      jsonBuffer,
      Buffer.from(`  '${mapKey}': '${formattedMessage}',`),
      Buffer.from(formattedContext ? ` // ${formattedContext}\n` : '\n'),
    ]);
  }

  // append previously removed closing curly brace
  jsonBuffer = Buffer.concat([jsonBuffer, Buffer.from('}\n')]);

  return jsonBuffer;
}
