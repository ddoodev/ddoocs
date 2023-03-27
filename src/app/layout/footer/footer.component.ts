import { Component, Input } from '@angular/core';

import { NavigationNode, VersionInfo } from 'app/navigation/navigation.service';

@Component({
  selector: 'aio-footer',
  template: `
    <p>
      Documentation code licensed under <a href="https://github.com/ddoodev/ddoocs/tree/develop/LICENSE">MIT LICENSE</a> and has multiple copyright holders.
    </p>
    <p>
      Other code are licensed under <a href="https://github.com/ddoodev/discordoo/tree/develop/LICENSE">MIT License</a>.
    </p>`
})
export class FooterComponent {
  @Input() nodes: NavigationNode[];
  @Input() versionInfo: VersionInfo;
}
