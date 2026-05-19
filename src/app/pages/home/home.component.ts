import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  stats = [
    { value: '48',    label: 'Clubs affiliés',      icon: '🏛️' },
    { value: '1 200', label: 'Licences actives',     icon: '🪪'  },
    { value: '12',    label: 'Médailles nationales', icon: '🥇'  },
    { value: '4',     label: 'Disciplines sportives',icon: '🏊'  }
  ];

  upcomingComps = [
    {
      name: 'Championnat National Hiver 2025',
      dateDisplay: '15 – 17 Nov 2025',
      city: 'Tunis', icon: '🏊', daysLeft: 12,
      borderColor: '#0057FF', tagColor: '#EEF4FF', tagText: '#0057FF'
    },
    {
      name: 'Open International de Sfax',
      dateDisplay: '22 Nov 2025',
      city: 'Sfax', icon: '🏊', daysLeft: 19,
      borderColor: '#00C48C', tagColor: '#ECFDF5', tagText: '#059669'
    },
    {
      name: 'Championnat Eau Libre Hammamet',
      dateDisplay: '5 Déc 2025',
      city: 'Hammamet', icon: '🌊', daysLeft: 32,
      borderColor: '#7C3AED', tagColor: '#F3EEFF', tagText: '#7C3AED'
    },
  ];

  quickCards = [
    {
      icon: '🏆', title: 'Résultats',   path: '/results',
      desc: 'Résultats officiels des compétitions nationales',
      gradient: 'linear-gradient(135deg, #0057FF 0%, #00C8F0 100%)',
      lightBg: '#EEF4FF'
    },
    {
      icon: '📅', title: 'Calendrier',  path: '/competitions',
      desc: 'Prochains événements et compétitions',
      gradient: 'linear-gradient(135deg, #00C48C 0%, #00C8F0 100%)',
      lightBg: '#ECFDF5'
    },
    {
      icon: '🏊', title: 'Athlètes',    path: '/athletes',
      desc: 'Profils et performances des nageurs',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #0057FF 100%)',
      lightBg: '#F3EEFF'
    },
    {
      icon: '📰', title: 'Actualités',  path: '/news',
      desc: 'Annonces et communiqués officiels',
      gradient: 'linear-gradient(135deg, #FF2D46 0%, #FFBE00 100%)',
      lightBg: '#FFF5F5'
    }
  ];

  disciplines = [
    {
      name: 'Natation',    icon: '🏊', desc: 'Bassin 25m et 50m',
      gradient: 'linear-gradient(160deg, #0033AA 0%, #0057FF 50%, #00C8F0 100%)'
    },
    {
      name: 'Eau Libre',   icon: '🌊', desc: '5km · 10km · 25km',
      gradient: 'linear-gradient(160deg, #001B50 0%, #003399 50%, #0057FF 100%)'
    },
    {
      name: 'Water Polo',  icon: '🤽', desc: 'Compétitions par équipes',
      gradient: 'linear-gradient(160deg, #005C3D 0%, #00C48C 60%, #00C8F0 100%)'
    },
    {
      name: 'Plongeon',    icon: '🤿', desc: 'Tremplin & plate-forme',
      gradient: 'linear-gradient(160deg, #4C1D95 0%, #7C3AED 50%, #DB2777 100%)'
    }
  ];
}
