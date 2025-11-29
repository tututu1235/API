const express = require('express');
const router = express.Router();

const pinMiddleware = (req, res, next) => {
    const request = require('request');
    const searchTitle = req.query.title;
    const count = req.query.count || 10;

    if (!searchTitle) return res.json({ error: 'Missing title parameter to execute the command' });

    const headers = {
        'authority': 'www.pinterest.com',
        'cache-control': 'max-age=0',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'sec-gpc': '1',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'same-origin',
        'sec-fetch-dest': 'empty',
        'accept-language': 'en-US,en;q=0.9',
        // --- নতুন কুকি এখানে যুক্ত করা হলো ---
        'cookie': 'csrftoken=6e639e03a3a4bfe9153409dc07bc8d5f; _auth=1; _b="AYvt/txKRXRHa6lip8twpoME992lY2d954Me5szRSBy9ce/S9rGDJMqSKaBKx+yNs08="; ar_debug=1; ar_debug=1; _pinterest_cm=TWc9PSZVOWlBTFFIRUkzMjVNTU9USi84a3ZSdDFTMWVvcDlUb1dPT1RQVFJaOVUyOGRLa3M4OFFiVk1aZzlnZkZkeGhCWkRqa2R5MkxpWC9UMnQ1R2lOdnZXSVN4bVMxbnNyNWF0L1oyZ0NnZldlWFFBRllxYjZpNmhiV3Q3RXI3WXZ5azBlRGdsbUg2aDRZY0RGMSsvRUpTQ3N2M3V1S0I3OGxvclcrcXhncXgxbmdQTytHaEErRXgzUUVjRUl0QXZtVjMmQ0hITjRYM045YmlNSWRTTXJ2RXQ3V0lTRlQwPQ==; _routing_id="fe57c89c-15f2-490f-9d5f-6b9d003f25c"; _pinterest_sess=TWc9PSZ3a0I5bEZueVZ4bXlGaGpqNHVPQTlKVEZXZDVZTzZQc0FUakNIdC9IdlBSczFuTk03STNGclhHaE9DYjZIcFNPeUdVOGZKMlYrVEV6eVArVUJpQUZwNjdBUTZsclpiQXV6MmJoMExPWk5UbFlpeTkxQkNpSllNL2NHMnRSblNnVmVNc1NBSXZ5RWhXd2VISXloKyt5bWFHamR2ZVl6VGxJR09kMm1GUWVYNUh4SWVtc0J4MVdUUkZVU3YveHg4enpVMVFmalNNUEJVOWZ1MHhXSk55R2l5WSswNlExMjViNDdlVk9hNi92K3ZvdSsyQnljTUdJNm9PckFlU2IxK1I5V0hweitlT25RR1I1eERuWHNraFRKbW0xOGFPY3g1NE1rM0RxbWxYSlhuNXVaY1FUNEkvMldFMTduTkZCbmMwU0FFVVlJTGtGWHVhVytqcUpNdnhGckM3WEhpOGFjNHBYRWVSZHRYQXA5Y2VkaWRrMXFQV2FrN3QrMHVYckxhdEpTVGY4M2drMnNnY3k0cWxzSTVnN3NwUHJqaDZVSkRjM0REWG45d1JjcWNyYmFQTW1DRTdvVUFXRFEwMHRaQjY0TUpiSmJhSS93eEd6eldlNUFjcFdIVXQ3M3pBa1lSUERzZzBFTUkyUzlRWW0yWHZMYmwvRmd0Ui9CZFBNdTlRa0FLMVFFZGh6TTVQTWhBTVQzY05vV0o0SXB4bkdGazlieThlU25EanU1L1J4dXI4R2lkd05rL3VkSHVMcy95K0xJckJPWXNWMHhkWXlGa0RjbFI1bDc1YzBDWThQZlYyMDQyRFJCdWtCdTJYa3FNTFBsbHpReG5Vbm5ZRXJxa01FYUFMVHp1cDVOQ2hXMHBQMG5PKzM2VHBKNUZKaWhDcC9RY1l1OGxqU1NZZ3NrRmtsYmJBS1JmN0RRWE9VZFNiTXZkTXN2Z1dkTnZ2RjhVZUgxcC8rWTZvK21GR0JtMk1xa1lGTDRBd2lRR1QzZlBNYWc3N1NkWE1UOGRRc1R3VFRTTWFsNTl0aGNIT042dHkvMTZpazc3dFBIZnBrNXc5L2tIaTJZR2ZkVmtzY2lrQU1mTWxvUnIrbCtJZGJ6YmhRbTZreHlBcWlKSW9iVms0ZXpKdzVDNGF6Y2dFREZuSzA2RTZLNWlKY2lqRXBjS2VDcDA0K0pjK3Ewa2h3QkRJSGk0eE1sTWhLTjNzSU5BK0FLVGhueitNS1VNSWROTEw3UVZHSzMxYkJEVzgyM05oRG90TXNRL05tRGVLTjN1STFDejczY0x4bXIyTzdEWlhxMmZ3dzlLZTRMS2F5UUxLdzdJcHJwUE9uSWtOZ0taMXJsQ1g5WG11UVVmRVJFRFI1dlh4WWdVQkdleW5reSszUEN0c2RlRjh1TldoQnNzdlplZDhBU1hNNWtobTZQTXozOTRGNlI1Y3BwM3NZbmdJbExvL0VsMEpKbXFjNXBHSWFQdUtaM0txNXhHbDBtOTlYNEk3U3dibGZHR0pXQ2RKWUIxZGorYnZCOGZkSnNiZnhrQ251SG93bFNMN0huNXFNNEowVlpqS3lIME14MFJqVEZQV01jMGR3VG1YVTVud2x0MjkyTllPSm14bm9pZldGUjh1OGtzQ3ZpZWNzZWoxVDRiUSs1cnl1RW5Kd3RUdnFvMG1KWlI5V0pTY0UzRjRuOVF5ZE1TTlRUWUxHak9HVGJ6ck5JeVZGMERjMmdIMm5pQlNqQ3dmQnRzYWFNM1pnOHZZbHE3SDJ3YlJtVzlWQWxoWG9EV3VxRWlIK3drLzAmc3ZoTE8rNEFGa3h5dkZ2TTRoTEVHTGZRMTBNPQ==; __Secure-s_a=eFgwMm1RLytZai82ZWNheU4rU1BxQk0vUkxINlpWMTQ1dGxTWDRpWE1sYmpQejAxQkpMYm85OHY1NUkwRTVkdWc1TDVBRmxDTk9mdkQraFRxTjJKaUE3eWlwZXFWeFBJN2lHTVZyYTUzWWcreEh1S0NQNTBVTU9vb3kwaytSeWg1RVJwcE9nSnp2NkVhbnFSUnpRclY2ZWQ4ekl0b0VhMzVEVWJMaEw4WXkwRlJJVm9WL3ZOZFdVZGcxWUp6RGhPTmk5bWZCbFFLc3NKVzVFRS9naDUvQ1l5VWdXcDRDRlhsSFVMQmNsekhXQklWVnQrYjY0WnFUY0FGTmZIWDQyd0NlUUJ2N2x4c3pTYVo3K0VKNXhyK2U0Ull5VGxTN3Y4T3pTTC9jeER3NmZDblhvSGRkWnpoMTdZVmNaa2tNREE4Rk9heWt2ZWtCZUIrQlB1WGhEWDR1Yk9xdWlYVHVXM3ZaK2RxZjNweXJwZXZmbXhnSkIrSnFTZTF5STVsd2FaNWxjb3grKzJTcnhzTHpsZVFyRTdqOWF6dnhpdGdoL2lHWDlBMVRoNTVNeXZWb3BQSy9CMFRtWVFuTzBSYmNYbFhDWllJWHc4NzY1VEpROWs3WHUzTm9sRmRidGFsWTBZZVplMEV3MXJRZVFRN1VmaC9WQlN3ZVhZOFVZcG1raVN1M1Fia0FuVm5WTWJZeUpwcXN3YkE0S3JZRi8zRXVqTUs4SkE5VHdhcTRZMXBpMmJqMjJFb1U3L0lzTkt4UjRXR3Ntd01PbHNraHA1WktjdXNQYWZMU3E0OHRXMXQ3U1lKYjF2eGdPN2Jackg2SHYrcU1Fa2dOK2t5SE9nTFFyekgxTU5PcUZZbTJTVG9qUGJXUDltRmxsQ2Y5VlEwS3Z3eHpXTy9xU2E2KzFEaW5yRHZSeUVQZDZYcDVTMkVCcDBnTWxjTlMwUWd3dVkwVmh6RWpBdjM2YUZKK05ZaHkya01MTDVNbEhvVVVBSjJHeUM3SjFucWl5ODZ5NUpJUmJUaUs4Z3lRM0I0SkNjUGYyWGVJQlYxSjRzcHBpKzZGY0dYR1czaithZWJTY3JjbzRHRmhRSEQwbGQzY3RibjdGL00vN2VpcnhnYzN0enB2bzRqdjFHM0xpbE00YUszQjQ3Z1RvWnJjMGRrNUhrZE15S1cwZThWWWZ0bHM0Q3RmS0tHYzUxQXhEWUlycG4xQ25sSEw5ZUdvL2FIM1lqdTRlVm1GaHN5TkhSaS8xLzlBK1VqRC93K2dRMk1LcUJHUXM0djgwUnR5UmM4dDRsYmpiSU8yOHpRSjJ3TlZGZ3VDbURQd1RVOGNyQzNvUT0mM29pa1lYTkltQzBUbnpwK294eEFpRDZRSlFFPQ==; sessionFunnelEventLogged=1; _pinterest_referrer=https://www.google.com/; g_state={"i_l":0,"i_ll":1764395789514,"i_b":"AvbuEJWElqFbBb1XWoedkbJmP7WQ9jv3IbQx5UfrUN0"}'
    };

    const options = {
        url: `https://www.pinterest.com/search/pins/?q=${searchTitle}&rs=typed&term_meta[]=${searchTitle}%7Ctyped`,
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            const arrMatch = body.match(/https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g);
            const limitedArrMatch = arrMatch.slice(0, count);
            res.json({
                count: limitedArrMatch.length,
                data: limitedArrMatch
            });
        } else {
            // যদি সফল না হয়, তবে এরর মেসেজ পাঠানো
            res.status(response ? response.statusCode : 500).json({ 
                error: 'Failed to fetch data from Pinterest.',
                details: error ? error.message : 'Check cookie validity or Pinterest site changes.'
            });
        }
    }

    request(options, callback);
};

// Applying middleware to the /pin route
router.use('/pin', pinMiddleware);

module.exports = router;
