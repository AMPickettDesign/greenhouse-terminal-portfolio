// Lore logs scattered across the facility.
// Each page can reference logs by id to surface them contextually.

export const loreLogs = [
  {
    id: 'log-001',
    title: 'FACILITY LOG — DAY 1',
    date: '2019-03-12',
    author: 'Dr. E. Marsh',
    location: 'lobby',
    content: `Greenhollow Research Facility has officially entered its quiet phase. The botanical containment units are sealed. Temperature and humidity stabilized. We expect results within eighteen months. Everything is proceeding as designed.`,
  },
  {
    id: 'log-047',
    title: 'ANOMALOUS GROWTH — SECTOR B',
    date: '2019-09-04',
    author: 'Dr. E. Marsh',
    location: 'experiment-logs',
    content: `Subjects in Sector B are exhibiting unexpected secondary root formations. Dr. Vance insists this is within acceptable parameters. I have noted my disagreement in the formal record. The formations are not botanical in any classification I recognize.`,
  },
  {
    id: 'log-089',
    title: 'PERSONNEL NOTE',
    date: '2020-01-19',
    author: 'HR SYSTEM',
    location: 'personnel',
    content: `Three staff members have requested reassignment from overnight monitoring duties. Requests denied pending review. Management notes that the sounds reported during night cycle are consistent with normal plant respiration at elevated growth phases. No further action required.`,
  },
  {
    id: 'log-112',
    title: 'SYSTEMS DIAGNOSTIC — CRITICAL',
    date: '2020-04-02',
    author: 'AUTO-SYSTEM',
    location: 'systems-lab',
    content: `ALERT: Primary containment seals in Sectors C through F have entered a degraded state. Recommend immediate inspection. This message has been queued for 72 hours. ALERT: Primary contain███████████ in Sectors █ through █ have entered a de████████ state.`,
    revealed: `ALERT: Primary containment seals in Sectors C through F have entered a degraded state. Recommend immediate inspection. This message has been queued for 72 hours. ALERT: Primary containment seals in Sectors C through F have entered a decommissioned state.`,
    contentSegments: [
      'ALERT: Primary containment seals in Sectors C through F have entered a degraded state. Recommend immediate inspection. This message has been queued for 72 hours. ALERT: Primary contain',
      { blocked: '███████████', revealed: 'ment seals' },
      ' in Sectors ',
      { blocked: '█', revealed: 'C' },
      ' through ',
      { blocked: '█', revealed: 'F' },
      ' have entered a de',
      { blocked: '████████', revealed: 'commissioned' },
      ' state.',
    ],
  },
  {
    id: 'log-final',
    title: '[ CORRUPTED — PARTIAL RECOVERY ]',
    titleRevealed: 'FINAL ENTRY — DR. E. MARSH',
    titleSegments: [
      { blocked: '[ CORRUPTED — PARTIAL RECOVERY ]', revealed: 'FINAL ENTRY — DR. E. MARSH' },
    ],
    date: '2020-07-██',
    dateRevealed: '2020-07-14',
    dateSegments: [
      '2020-07-',
      { blocked: '██', revealed: '14' },
    ],
    author: '████████',
    authorRevealed: 'Dr. E. Marsh',
    authorSegments: [
      { blocked: '████████', revealed: 'Dr. E. Marsh' },
    ],
    location: 'communications',
    content: `If anyone is reading this — leave the way you came in. Don't go past the greenhouse. Don't look at the █████ directly. The facility does not want to be documented. It wants to be █████████████. I'm sorry I ever thought this was just a design project.`,
    revealed: `If anyone is reading this — leave the way you came in. Don't go past the greenhouse. Don't look at the roots directly. The facility does not want to be documented. It wants to be left alone. I'm sorry I ever thought this was just a design project.`,
    contentSegments: [
      'If anyone is reading this — leave the way you came in. Don\'t go past the greenhouse. Don\'t look at the ',
      { blocked: '█████', revealed: 'roots' },
      ' directly. The facility does not want to be documented. It wants to be ',
      { blocked: '█████████████', revealed: 'left alone' },
      '. I\'m sorry I ever thought this was just a design project.',
    ],
  },
]

export function getLogsForLocation(location) {
  return loreLogs.filter(log => log.location === location)
}
