
import * as React from 'react';
import { writeFileSync } from 'fs';
import { renderToStream } from "../src/index";

renderToStream(
  React.createElement(
    'Container',
    {
      style: {
        width: 500,
        height: 500,
        backgroundColor: 'orange'
      }
    },
    React.createElement(
      'View',
      {
        style: {
          width: 460,
          height: 380,
          marginTop: 100,
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 5,
          backgroundColor: 'white'
        }
      },
      React.createElement(
        'Image', {
          src: __dirname + '/icon.png',
          style: {
            width: 80,
            height: 80,
            marginLeft: 180,
            backgroundColor: 'green',
          }
        }
      ),
      React.createElement(
        'View',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'yellow',
            flexDirection: 'row'
          }
        },
        React.createElement(
          'View',
          {
            style: {
              backgroundColor: 'black',
              width: 90,
              height: 60
            }
          },
          React.createElement(
            'Text',
            {},
            'test1'
          )
        ),
        React.createElement(
          'View',
          {
            style: {
              backgroundColor: 'blue',
              width: 90,
              height: 60
            }
          },
          React.createElement(
            'Text',
            {},
            'test2'
          )
        )
      )
    )
  )
).then(buffer => {
  writeFileSync('./test.png', buffer);
});
