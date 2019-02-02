import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";

const Layout: any = null

@classNames("page-footer")
export default class PageFooter extends Component {
	didInsertElement() {
		Layout.init();
	}
}
