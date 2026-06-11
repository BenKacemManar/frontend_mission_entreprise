export function getAthleteImage(athleteId: number, gender?: string): string {
  const maleImages = [
    'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=600&q=80'
  ];

  const femaleImages = [
    'https://images.unsplash.com/photo-1593055497705-59a84c5928b2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80'
  ];

  const generalImages = [
    'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1538386526337-eb7a37267d11?auto=format&fit=crop&w=600&q=80'
  ];

  const id = Number(athleteId) || 0;
  const g = (gender || '').toUpperCase();

  if (g === 'MASCULIN' || g === 'M') {
    return maleImages[id % maleImages.length];
  } else if (g === 'FEMININ' || g === 'F') {
    return femaleImages[id % femaleImages.length];
  }
  return generalImages[id % generalImages.length];
}

export function getClubImage(clubId: number): string {
  const clubImages = [
    'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e3a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1575429182435-c5332f7413d3?auto=format&fit=crop&w=600&q=80'
  ];

  const id = Number(clubId) || 0;
  return clubImages[id % clubImages.length];
}
