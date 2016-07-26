# Understanding subway stations

In large subway networks, it is sometimes very hard to understand how the tunnels,
platforms, entrances and stairs are laid out.

The user just follows the arrows and is completely disoriented.

On the street level, we can combine signs and maps, to either follow directions,
or understand how the streets are laid out and find our own path.

This projects tries to give some kind of representation of the many layers of a
subway station.

A demonstration runs at: https://tristramg.github.io/parisfellowship

## Data sources

We only use data from [OpenStreetMap](https://www.openStreetmap.org).

The sources come in different formats, depending on our needs.

- Vector tiles by [Mapzen](https://mapzen.com/projects/vector-tiles/),
- GeoJSON, hand curated for our needs.

### Specifics extracts

Some tags are removed in the vector tiles provided by Mapzen.

That is why we generated our own GeoJSON for some specifc stations using
[Imposm3](https://imposm.org/docs/imposm3/latest/) to import it in a
[PostGIS](http://postgis.net/) spatial database and extract them with
[ogr2ogr](http://www.gdal.org/ogr2ogr.html) as GeoJSON files.

Once the data is in the PostGIS database, it could be a good moment to
modify the data if needed, for instance using [QGis](https://www.qgis.org/).
Obviously, do not forget to add the modifications upstream in OpenStreetMap.

Here is a cheat sheet of the used commands:

- `./imposm3 import  -mapping mapping.yaml -read idf.osm.pbf -overwritecache -write -srid 4326 -connection postgis://osm:osm@localhost/osm?prefix=NONE`
- `./imposm3 import  -mapping mapping.yaml -deployproduction -connection postgis://osm:osm@localhost/osm?prefix=NONE`
- `ogr2ogr -f GeoJSON subway.geojson  PG:dbname=osm -sql "select *from routes JOIN route_members ON routes.osm_id = route_members.osm_id JOIN roads ON roads.osm_id = route_members.member WHERE route='subway';"`
- `ogr2ogr -f GeoJSON areas.geojson  PG:dbname=osm -sql "select * from transport_areas"`

## Rendering

Mapzen’s [Tangram](https://mapzen.com/products/tangram/) is the main rendering
tool used. It is based on [Leaflet](https://leafletjs.com/).

The map style is widely ripped off from the
[Refill style](https://github.com/tangrams/refill-style), itself inspired
by Stamen’s [Toner style](http://maps.stamen.com/toner).

In order to be able to tilt the camera, we used an interesting hack
described on https://mapzen.com/blog/tilting-ikeda/.

## Further work

### Technical stack

Tangram was not designed to move the camera around. It might [change in the
future](https://twitter.com/professorlemeza/status/757605163779579904).

An alternative would be to explore tools better suited for 3D rendering in a
browser like [three.js](http://threejs.org/), but the design of each feature
will not be as easy.

One frustrating limitation is to render slopes:

- stairs, escalators,
- the subway switching from tunnel to aerial segment.

### Better data

So far, the data in OpenStreetMap is generally not detailed enough to represent different
levels. Subway stations are not as nicely organized as a shopping mall. For
instance some corridors go only one meter deeper to pass below a subway
tunnel.

Mapping the detailed depths from the street level would significantly
simplify and improve the quality of the mapping.

For subways, setting the depth at the beginning and the end of a `way` would
allow to represent the slopes.

Using the actual elevation would be a step even further. It would show how
a subway follows or not some hill in the city.

### Better styling

Making a nice and legible representation is difficult. Adding the third
dimension makes it worth.
