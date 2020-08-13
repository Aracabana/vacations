import CountryInfo from '../components/CountryInfo';
import BudgetWidget from '../components/widgets/BudgetWidget';
import TimeWidget from '../components/widgets/TimeWidget';
import WeatherWidget from '../components/widgets/WeatherWidget';

export default function(widget) {
  let newWidget;
  const widgetInfo = {
    id: widget.id,
    name: widget.name
  }

  switch (widget.name) {

    case 'Текущее время':
      newWidget = {
        component: TimeWidget,
        props: {...widgetInfo, containerSize: 4}
      }
      break;

    case 'Общая информация':
      newWidget = {
        component: CountryInfo,
        props: {...widgetInfo, containerSize: 8}
      }
      break;

    case 'Погода':
      newWidget = {
        component: WeatherWidget,
        props: {...widgetInfo, containerSize: 4}
      }
      break;

    case 'Бюджет':
      newWidget = {
        component: BudgetWidget,
        props: {...widgetInfo, containerSize: 4}
      }

  }

  return newWidget;
}
