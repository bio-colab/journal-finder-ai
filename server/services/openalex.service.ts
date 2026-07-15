export class OpenAlexService {
  static async fetchRealJournals(keywordsStr: string, filters: any): Promise<string> {
    try {
      const kws = keywordsStr.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 2);
      const topKws = kws.slice(0, 2);
      if (topKws.length === 0) topKws.push('research');

      const scopes = filters.scopes || [];
      const includeGlobal = scopes.includes('Global') || scopes.length === 0;
      const includeIraqi = scopes.includes('Local (Iraqi)');
      const includeArab = scopes.includes('Arab');

      let arabCountries = 'eg|sa|ae|jo|lb|ma|dz|tn|qa|kw|om|bh|sd|sy';
      if (includeIraqi) arabCountries += '|iq';

      let baseFilters = 'type:journal';
      if (filters.accessType === 'Open Access') baseFilters += ',is_oa:true';
      if (filters.indexing?.includes('DOAJ')) baseFilters += ',is_in_doaj:true';
      
      const mailto = `mailto=${process.env.OPENALEX_MAILTO || 'your-email@example.com'}`;

      const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(id);
          return await res.json();
        } catch (err) {
          clearTimeout(id);
          return {};
        }
      };

      const fetchPromises: Promise<any>[] = [];

      for (const kw of topKws) {
        const encodedKw = encodeURIComponent(kw);
        
        if (includeGlobal) {
          fetchPromises.push(fetchWithTimeout(`https://api.openalex.org/sources?search=${encodedKw}&filter=${baseFilters}&per-page=15&${mailto}`));
        }
        
        if (includeIraqi && !includeArab) {
          fetchPromises.push(fetchWithTimeout(`https://api.openalex.org/sources?search=${encodedKw}&filter=${baseFilters},country_code:iq&per-page=10&${mailto}`));
        } else if (includeArab || includeIraqi) {
          fetchPromises.push(fetchWithTimeout(`https://api.openalex.org/sources?search=${encodedKw}&filter=${baseFilters},country_code:${arabCountries}&per-page=15&${mailto}`));
        }
      }

      // If no keyword search hits, fallback to a general country search if local/arab is requested
      if (fetchPromises.length === 0) {
          fetchPromises.push(fetchWithTimeout(`https://api.openalex.org/sources?filter=${baseFilters}&per-page=20&${mailto}`));
      }

      const results = await Promise.all(fetchPromises);
      const allJournals = new Map<string, any>();

      results.forEach(res => {
        if (res && res.results) {
          res.results.forEach((j: any) => {
            if (!allJournals.has(j.id)) {
              allJournals.set(j.id, j);
            }
          });
        }
      });

      const formattedJournals = Array.from(allJournals.values()).filter(j => {
        if (filters.apc === 'Free') {
           const hasApc = j.apc_prices && j.apc_prices.length > 0;
           return !hasApc && j.has_apc !== true;
        }
        return true;
      }).slice(0, 40).map(j => {
        const apc = j.apc_prices && j.apc_prices.length > 0 ? `${j.apc_prices[0].price} ${j.apc_prices[0].currency}` : (j.has_apc === false ? '0' : 'Unknown');
        const impact = j.summary_stats?.['2yr_mean_citedness'] ? j.summary_stats['2yr_mean_citedness'].toFixed(2) : 'N/A';
        const url = j.homepage_url || j.id;
        return `- Journal: "${j.display_name}" | Publisher: "${j.host_organization_name || 'Unknown'}" | OA: ${j.is_oa} | DOAJ: ${j.is_in_doaj} | APC: ${apc} | Approx Impact Score: ${impact} | URL: ${url}`;
      });

      return formattedJournals.join('\n');
    } catch (error) {
      console.error("Error fetching from OpenAlex:", error);
      return "No real journals could be fetched. Proceed with your best knowledge.";
    }
  }
}
