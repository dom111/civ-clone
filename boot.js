const {
  FlexLayout,
  QLabel,
  QMainWindow,
  QWidget
} = NodeGui;
import NodeGui from '@nodegui/nodegui';
import {Worker} from 'worker_threads';

const win = new QMainWindow();

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setInlineStyle("font-size: 16px; font-weight: bold;");
label.setText("Loading...");

rootLayout.addWidget(label);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #e7e7e7;
    }
  `
);

win.show();

global.window = win;

const engine = new Worker('./engine.js', {
  workerData: null,
});

engine.on('message', ({event, args}) => {
  label.setText(event);
  // console.log(event, args);
});
