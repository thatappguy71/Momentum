import { regions, type Region } from '../lib/regions';

export function RegionSelector({ 
  selectedRegion, 
  onRegionChange 
}: {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}) {
  return (
    <select 
      value={selectedRegion.code} 
      onChange={(e) => {
        const region = regions.find(r => r.code === e.target.value);
        if (region) {
          onRegionChange(region);
        }
      }}
    >
      {regions.map(region => (
        <option key={region.code} value={region.code}>
          {region.name}
        </option>
      ))}
    </select>
  );
}