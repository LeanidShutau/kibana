import { map, uniq } from 'lodash';
import { getState, getValue } from '../../lib/resolved_arg';
import { legendOptions } from '../../lib/legend_options';

const styleProps = ['lines', 'bars', 'points', 'fill', 'stack'];

export const plot = () => ({
  name: 'plot',
  displayName: 'Chart Style',
  modelArgs: ['x', 'y', 'color', 'size', 'text'],
  args: [
    {
      name: 'palette',
      argType: 'palette',
    },
    {
      name: 'legend',
      displayName: 'Legend Position',
      help: 'Disable or position the legend',
      argType: 'select',
      default: 'ne',
      options: {
        choices: legendOptions,
      },
    },
    {
      name: 'xaxis',
      displayName: 'X-Axis',
      help: 'Configure or disable the x-axis',
      argType: 'axisConfig',
      default: true,
    },
    {
      name: 'yaxis',
      displayName: 'Y-Axis',
      help: 'Configure or disable the Y-axis',
      argType: 'axisConfig',
      default: true,
    },
    {
      name: 'font',
      argType: 'font',
    },
    {
      name: 'defaultStyle',
      displayName: 'Default style',
      help: 'Set the style to be used by default by every series, unless overridden.',
      argType: 'seriesStyle',
      default: '{seriesStyle points=5}',
      options: {
        include: styleProps,
      },
    },
    {
      name: 'seriesStyle',
      argType: 'seriesStyle',
      default: '{seriesStyle points=5}',
      options: {
        include: styleProps,
      },
      multi: true,
    },
  ],
  resolve({ context }) {
    if (getState(context) !== 'ready') return { labels: [] };
    return { labels: uniq(map(getValue(context).rows, 'color').filter(v => v !== undefined)) };
  },
});
