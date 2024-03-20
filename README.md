How to start it:
  Prerequisites:
  artist.csv and track.csv files located int project_dir/data/ folder
  A postgres database running localy
    - Add DATABASE_URL="postgres://USER:PASSWORD@localhost:PORT/DB?schema=SCHEMA" to .env
  AWS Account with a bucket
    - Add 
      AWS_ACCESS_KEY_ID="{Your Access Key ID}"
      AWS_SECRET_ACCESS_KEY="{Your Secret Access Key}"
      AWS_ROLE_ARN="{Your AWS Role ARN}"
  ```
  npm install
  npx prisma migrate dev
  npm run build
  npm start
  ```
Everytime you want to restart run ```npx prisma migrate restart``` before ```npm start```. Not necessary if you rebuild the application.

SQL Views:
```
CREATE VIEW TrackWithArtistFollowers AS
SELECT
    t.id AS track_id,
    t.name AS track_name,
    t.popularity,
    t.energy,
    t.danceability,
    SUM(a.followers) AS followers
FROM
    "Track" t
JOIN
    "Artist" a ON a.id = ANY(t.id_artists)
WHERE
    a.followers > 0
GROUP BY
    track_id,
    track_name,
    energy,
    danceability,
    followers;

CREATE CREATE VIEW MostEnergizingTracksPerYear AS
SELECT
	track_id,
	track_name,
	popularity,
	energy,
	danceability,
	followers
FROM(
	SELECT
		t.id AS track_id,
		t.name AS track_name,
		t.popularity AS popularity,
		t.energy AS energy,
		t.danceability AS danceability,
		sum(a.followers) AS followers,
		ROW_NUMBER() OVER (PARTITION BY t.release_year ORDER BY energy DESC) AS rn
	FROM
		"Track" t
	JOIN
		"Artist" a ON a.id = ANY(t.id_artists)
	WHERE
		a.followers > 0
	GROUP BY
		track_id,
		track_name,
		energy,
		danceability,
		followers
) ranked_tracks
WHERE
	rn = 1;
```
What doesn't work?
 - File reading
   - It works, but there are problems. Some data gets lost due to data corruption, some data doesn't get read because a chunk ends in the midlle of a line.
   - Got stuck here, tried a few different approaches. None of them worked.
 - S3 File upload. Files get sent to the bucket, but there's some problems with my permissions or the code that give me this error as a whole xml file instead of uploaded .cs file: ```SignatureDoesNotMatch```
 - 

Otherwise everything seems to be working in the middle of that.
I did not write functions that would create the SQL views, but using pgAdmin 4 I tested them out and they return a result. Whether the result is correct or not I cannot say. It looks correct.
The result after filtering and transformation also will not be 100% correct cause file reading gives it incorrect data to begin with (ofcourse not the whole data gets corrupted).
I didn't manage to write tests. To much time was wasted elsewhere. What I would've done though is test out every single function and try to test out every single outcome of said function. But I didn't so words be words.

I'm not proud of how I managed to finish(not finish) this task and deffinitelly not proud of the code quality.
Even then I think I managed to learn something new along the way
