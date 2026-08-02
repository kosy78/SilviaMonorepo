import { Tag } from "@/components/ui/tag";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type BlogPreview = {
  description: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  title: string;
  tone: "body" | "changes" | "relations";
};

type HomepageBlogCarouselProps = {
  previews: ReadonlyArray<BlogPreview>;
};

function HomepageBlogCarousel({ previews }: HomepageBlogCarouselProps) {
  return (
    <Carousel
      className="homepage-blog__carousel"
      opts={{ align: "start" }}
      aria-label="Articole în pregătire"
      aria-roledescription="carusel"
    >
      <header className="homepage-blog__header">
        <div className="homepage-blog__heading">
          <Tag variant="section">Din blog</Tag>
          <h2 id="homepage-blog-title">Texte pentru reflecție</h2>
        </div>

        <div className="homepage-blog__actions">
          <div className="homepage-blog__controls">
            <CarouselPrevious
              className="homepage-blog__control"
              aria-label="Articolul anterior"
            />
            <CarouselNext
              className="homepage-blog__control"
              aria-label="Articolul următor"
            />
          </div>
        </div>
      </header>

      <CarouselContent className="homepage-blog__track">
        {previews.map((preview) => (
          <CarouselItem
            key={preview.title}
            className="homepage-blog__slide basis-[88%] sm:basis-[55%] lg:basis-1/3"
            aria-label={preview.title}
            aria-roledescription="articol"
          >
            <div className="h-full p-1">
              <Card className="homepage-blog__card h-full gap-0 py-0">
                <div className="homepage-blog__visual" data-tone={preview.tone}>
                  <img
                    src={preview.imageSrc}
                    width={preview.imageWidth}
                    height={preview.imageHeight}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <Tag variant="status" className="homepage-blog__status">
                    În pregătire
                  </Tag>
                </div>

                <CardHeader className="homepage-blog__card-header">
                  <CardTitle asChild>
                    <h3 className="homepage-blog__card-title">
                      {preview.title}
                    </h3>
                  </CardTitle>
                  <CardDescription className="homepage-blog__card-description">
                    {preview.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default HomepageBlogCarousel;
