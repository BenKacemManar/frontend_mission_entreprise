import { Component } from '@angular/core';
import { Map } from 'lucide-angular';

@Component({
  selector: 'app-pools-map',
  templateUrl: './pools-map.component.html',
  styleUrls: ['./pools-map.component.scss']
})
export class PoolsMapComponent {
  readonly Map = Map;
}
